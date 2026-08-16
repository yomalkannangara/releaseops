#!/usr/bin/env bash

set -Eeuo pipefail

release_sha="${1:?Usage: ./deploy.sh <40-character-git-sha>}"
deploy_dir="${DEPLOY_DIR:-/home/ubuntu/releaseops-deploy}"
production_url="${PRODUCTION_URL:-https://releaseops-yk.duckdns.org}"

if [[ ! "$release_sha" =~ ^[a-f0-9]{40}$ ]]; then
    echo "Invalid Git commit SHA: $release_sha"
    exit 1
fi

cd "$deploy_dir"

new_backend_image="ghcr.io/yomalkannangara/releaseops-backend:${release_sha}"
new_frontend_image="ghcr.io/yomalkannangara/releaseops-frontend:${release_sha}"
rollback_available=false

compose() {
    docker compose \
        --env-file .env \
        --env-file .release.env \
        "$@"
}

wait_for_health() {
    local attempt

    for attempt in $(seq 1 12); do
        if curl --fail --silent --show-error \
            "${production_url}/health" >/dev/null; then
            return 0
        fi

        echo "Health check ${attempt}/12 failed; retrying..."
        sleep 5
    done

    return 1
}

rollback() {
    trap - ERR
    set +e

    echo "Deployment failed. Restoring previous containers..."

    cp compose.yml.rollback compose.yml
    cp Caddyfile.rollback Caddyfile
    cp .release.env.rollback .release.env

    compose up -d \
        --force-recreate \
        backend frontend caddy

    if wait_for_health; then
        echo "Rollback completed and the previous release is healthy."
    else
        echo "Rollback completed, but its health check also failed."
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

printf 'BACKEND_IMAGE=%s\nFRONTEND_IMAGE=%s\n' \
    "releaseops-backend:rollback" \
    "releaseops-frontend:rollback" \
    > .release.env.rollback

rollback_available=true

mv compose.yml.new compose.yml
mv Caddyfile.new Caddyfile
mv .release.env.new .release.env

echo "Deploying commit ${release_sha}..."

compose pull backend frontend
compose up -d --remove-orphans

compose exec -T caddy \
    caddy reload --config /etc/caddy/Caddyfile

if ! wait_for_health; then
    echo "The new release did not become healthy."
    false
fi

trap - ERR

echo "Deployment ${release_sha} completed successfully."
compose ps