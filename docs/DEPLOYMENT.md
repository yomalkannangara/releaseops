# ReleaseOps Deployment Guide

## Overview

ReleaseOps is deployed to Oracle Cloud Infrastructure using Docker Compose and GitHub Actions.

The deployment process uses versioned Docker images stored in GitHub Container Registry and deploys the exact Git commit associated with the workflow run.

## Production Components

Production runs the following containers:

* ReleaseOps frontend
* ReleaseOps backend
* PostgreSQL
* Caddy
* Prometheus
* Grafana
* Node Exporter

The application is publicly available through Caddy over HTTPS.

## CI/CD Flow

```text
Push to main
    |
    v
GitHub Actions CI
    |
    +--> Backend tests
    +--> Frontend lint/build
    +--> Trivy security scan
    +--> Docker build validation
    |
    v
Publish Docker Images
    |
    v
GitHub Container Registry
    |
    v
Deploy Production
    |
    +--> Record deployment
    +--> SSH to OCI server
    +--> Deploy exact commit
    +--> Run health check
    +--> Roll back on failure
    +--> Record final result
```

## Docker Image Tags

Application images are published using:

```text
latest
<git-commit-sha>
```

Production deployment uses the commit SHA rather than relying only on `latest`.

Example:

```text
ghcr.io/yomalkannangara/releaseops-backend:<commit-sha>
ghcr.io/yomalkannangara/releaseops-frontend:<commit-sha>
```

## Production Secrets

Sensitive values are not stored directly in the repository.

Production configuration includes values such as:

* PostgreSQL password
* JWT secret
* Grafana administrator password
* deployment SSH key
* deployment host information
* ReleaseOps deployment account credentials

GitHub Actions secrets and environment variables are used to provide these values.

## Deployment Process

The deployment workflow:

1. Waits for CI to complete successfully.
2. Waits for Docker images to publish successfully.
3. Records an `IN_PROGRESS` deployment in ReleaseOps.
4. Copies deployment configuration to the OCI instance.
5. Connects to the server over SSH.
6. Executes the production deployment script.
7. Deploys images associated with the exact Git commit.
8. Performs application health verification.
9. Records the final deployment result.

## Health Verification

The public ReleaseOps health endpoint is checked after deployment.

A successful deployment must respond successfully before the deployment is considered complete.

## Automatic Rollback

Before replacing the running release, the deployment process keeps enough information to return to the previous working version.

If the new release fails:

```text
New deployment
      |
      v
Health check fails
      |
      v
Restore previous version
      |
      v
Verify restored service
```

The deployment record is then updated to indicate the failure or rollback result.

## HTTPS

Caddy is the public reverse proxy.

Public ports:

```text
80  -> HTTP
443 -> HTTPS
```

Caddy automatically redirects HTTP traffic to HTTPS and manages TLS certificates.

PostgreSQL and internal monitoring services are not directly published to the internet.

## Manual Verification

After deployment, verify:

```bash
curl -I https://releaseops-yk.duckdns.org
```

Check health:

```bash
curl https://releaseops-yk.duckdns.org/health
```

Then verify that:

* the frontend loads
* authentication works
* backend APIs respond
* Grafana loads
* the latest deployment appears in ReleaseOps
* containers are healthy

## Production Container Check

On the OCI server:

```bash
docker compose ps
```

All required containers should be running and healthy.

## Infrastructure

OCI infrastructure is represented using Terraform.

Before infrastructure changes:

```bash
terraform fmt
terraform validate
terraform plan
```

Review the plan before applying changes.

## Deployment Principle

A ReleaseOps production deployment is not considered successful simply because Docker containers started.

The deployment must also pass the application health verification stage.
