#!/usr/bin/env bash

set -Eeuo pipefail

release_sha="${1:?Usage: ./deploy.sh <40-character-git-sha>}"
deploy_dir="${DEPLOY_DIR:-/home/ubuntu/releaseops-deploy}"
production_url="${PRODUCTION_URL:-https://releaseops-yk.duckdns.org}"
monitoring_archive="monitoring.tar.gz.new"
monitoring_new_dir=".monitoring.new"
monitoring_rollback_dir=".monitoring.rollback"
rollback_available=false

if [[ ! "$release_sha" =~ ^[a-f0-9]{40}$ ]]; then
    echo "Invalid Git commit SHA: $release_sha"
    exit 1
fi

cd "$deploy_dir"

new_backend_image="ghcr.io/yomalkannangara/releaseops-backend:${release_sha}"
new_frontend_image="ghcr.io/yomalkannangara/releaseops-frontend:${release_sha}"

compose() {
    docker compose \
        --env-file .env \
        --env-file .release.env \
        "$@"
}

wait_for_application() {
    local attempt

    for attempt in $(seq 1 12); do
        if curl --fail --silent --show-error \
            "${production_url}/health" >/dev/null; then
            return 0
        fi

        echo "Application health check ${attempt}/12 failed; retrying..."
        sleep 5
    done

    return 1
}

wait_for_monitoring() {
    local attempt

    for attempt in $(seq 1 12); do
        if curl --fail --silent --show-error \
            "${production_url}/grafana/api/health" >/dev/null \
            && compose exec -T prometheus \
                wget -q --spider http://127.0.0.1:9090/-/healthy; then
            return 0
        fi

        echo "Monitoring health check ${attempt}/12 failed; retrying..."
        sleep 5
    done

    return 1
}

restore_monitoring_configuration() {
    rm -rf monitoring

    if [[ -d "$monitoring_rollback_dir" ]]; then
        mv "$monitoring_rollback_dir" monitoring
    fi
}

rollback() {
    local rollback_services=(backend frontend caddy)
    local service

    trap - ERR
    set +e

    echo "Deployment failed. Restoring previous containers and configuration..."

    cp compose.yml.rollback compose.yml
    cp Caddyfile.rollback Caddyfile
    cp .release.env.rollback .release.env
    restore_monitoring_configuration

    for service in node-exporter prometheus grafana; do
        if compose config --services | grep -Fxq "$service"; then
            rollback_services+=("$service")
        fi
    done

    compose up -d \
        --force-recreate \
        --remove-orphans \
        "${rollback_services[@]}"

    if wait_for_application; then
        echo "Rollback completed and the previous release is healthy."
    else
        echo "Rollback completed, but its application health check failed."
    fi

    if compose config --services | grep -Fxq grafana; then
        if wait_for_monitoring; then
            echo "Previous monitoring stack is healthy."
        else
            echo "Previous monitoring stack did not become healthy."
        fi
    fi

    compose ps
}

handle_failure() {
    local exit_code=$?

    if [[ "$rollback_available" == "true" ]]; then
        rollback
    else
        echo "Deployment stopped before production was changed."
    fi

    exit "$exit_code"
}

trap handle_failure ERR

[[ -f "$monitoring_archive" ]] || {
    echo "Missing deployment file: $monitoring_archive"
    exit 1
}

tar -tzf "$monitoring_archive" >/dev/null
rm -rf "$monitoring_new_dir"
mkdir -p "$monitoring_new_dir"
tar -xzf "$monitoring_archive" -C "$monitoring_new_dir"

test -f "$monitoring_new_dir/prometheus.yml"
test -f "$monitoring_new_dir/grafana/provisioning/datasources/prometheus.yml"
test -f "$monitoring_new_dir/grafana/provisioning/dashboards/dashboards.yml"
test -f "$monitoring_new_dir/grafana/dashboards/releaseops-overview.json"

printf 'BACKEND_IMAGE=%s\nFRONTEND_IMAGE=%s\n' \
    "$new_backend_image" \
    "$new_frontend_image" \
    > .release.env.new

docker compose \
    --env-file .env \
    --env-file .release.env.new \
    -f compose.yml.new \
    config --quiet

docker container inspect releaseops-backend >/dev/null
docker container inspect releaseops-frontend >/dev/null

docker image tag \
    "$(docker inspect --format='{{.Image}}' releaseops-backend)" \
    releaseops-backend:rollback

docker image tag \
    "$(docker inspect --format='{{.Image}}' releaseops-frontend)" \
    releaseops-frontend:rollback

cp compose.yml compose.yml.rollback
cp Caddyfile Caddyfile.rollback

rm -rf "$monitoring_rollback_dir"
if [[ -d monitoring ]]; then
    cp -a monitoring "$monitoring_rollback_dir"
fi

printf 'BACKEND_IMAGE=%s\nFRONTEND_IMAGE=%s\n' \
    "releaseops-backend:rollback" \
    "releaseops-frontend:rollback" \
    > .release.env.rollback

rollback_available=true

mv compose.yml.new compose.yml
mv Caddyfile.new Caddyfile
mv .release.env.new .release.env

rm -rf monitoring
mv "$monitoring_new_dir" monitoring
rm -f "$monitoring_archive"

echo "Deploying commit ${release_sha}..."

compose pull backend frontend
compose up -d --remove-orphans

# Recreate services that bind deployment configuration files so they see
# the newly activated Caddy, Prometheus and Grafana configuration.
compose up -d --force-recreate prometheus grafana caddy

if ! wait_for_application; then
    echo "The new application release did not become healthy."
    false
fi

if ! wait_for_monitoring; then
    echo "The new monitoring stack did not become healthy."
    false
fi

trap - ERR

echo "Deployment ${release_sha} completed successfully."
compose ps
