# ReleaseOps

ReleaseOps is a production-style service, incident, and deployment management platform built as a combined Software Engineering and DevOps portfolio project.

The platform allows teams to manage software services, track incidents, monitor deployment history, and observe production health.

Its CI/CD pipeline automatically tests, scans, builds, publishes, deploys, health-checks, and records production deployments back into ReleaseOps.

## Live Application

Production:

`https://releaseops-yk.duckdns.org`

Grafana:

`https://releaseops-yk.duckdns.org/grafana/`

## Core Features

* JWT authentication
* Role-based access control
* Software service management
* Incident tracking
* Deployment history
* Git commit tracking
* Deployment status tracking
* Audit logging
* Production health monitoring
* Automatic deployment reporting
* Automatic failed-release rollback
* PostgreSQL backup and tested restoration

## Technology Stack

### Frontend

* React
* TypeScript

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Flyway
* JWT

### Database

* PostgreSQL

### DevOps

* Docker
* Docker Compose
* GitHub Actions
* GitHub Container Registry
* Oracle Cloud Infrastructure
* Terraform
* Caddy
* HTTPS
* Prometheus
* Grafana
* Node Exporter
* Trivy

## Architecture

```text
                    Internet
                       |
                    HTTPS
                       |
                       v
                     Caddy
                 /           \
                v             v
        React Frontend      Grafana
                |
                v
        Spring Boot API
           /          \
          v            v
    PostgreSQL     Prometheus
                       ^
                       |
                 Node Exporter
```

Production services run as Docker containers on an Oracle Cloud compute instance.

PostgreSQL, Prometheus, and other internal services are not directly exposed to the public internet.

## CI/CD Pipeline

```text
git push
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
Deploy to OCI
    |
    +--> Record deployment start
    +--> Deploy exact Git commit
    +--> Health check
    |
    +--> Success
    |      |
    |      v
    |   Record SUCCESS
    |
    +--> Failure
           |
           v
       Automatic rollback
           |
           v
       Record result
```

Docker images are tagged using the Git commit SHA so production deployments can identify the exact application version being deployed.

## Infrastructure as Code

Oracle Cloud infrastructure is represented using Terraform.

Terraform manages:

* VCN
* public subnet
* internet gateway
* route table
* security list
* compute instance
* DHCP configuration

The imported OCI environment has been validated with:

```bash
terraform validate
terraform plan -detailed-exitcode
```

with Terraform reporting no infrastructure drift.

## Monitoring

ReleaseOps uses:

* Spring Boot Actuator
* Prometheus
* Grafana
* Node Exporter

Monitoring covers application and host-level health and metrics.

Grafana is available through the production HTTPS reverse proxy.

## Security

ReleaseOps includes:

* JWT authentication
* RBAC
* password hashing
* HTTPS
* secure HTTP headers
* environment-based secrets
* GitHub Actions secrets
* private PostgreSQL networking
* Trivy vulnerability scanning
* SSH-based deployment
* deployment health checks
* automatic rollback
* tested database recovery

See [SECURITY.md](SECURITY.md) for details.

## Backup and Disaster Recovery

PostgreSQL backups are created using:

```bash
./scripts/backup-db.sh
```

Backups are compressed and timestamped.

Restore:

```bash
./scripts/restore-db.sh backups/<backup-file>.sql.gz
```

The recovery process has been tested by:

1. Creating database data.
2. Taking a backup.
3. Deleting the data.
4. Restoring the backup.
5. Confirming that the deleted data was successfully recovered.

See [Disaster Recovery](docs/DISASTER_RECOVERY.md).

## Documentation

* [Architecture](docs/ARCHITECTURE.md)
* [Deployment](docs/DEPLOYMENT.md)
* [Disaster Recovery](docs/DISASTER_RECOVERY.md)
* [Security](SECURITY.md)

## Local Development

Create the required environment configuration and start the complete stack:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Local services include:

```text
Frontend      http://localhost:3000
Backend       http://localhost:8080
PostgreSQL    localhost:5433
Prometheus    http://localhost:9090
Grafana       http://localhost:3001
```

Stop:

```bash
docker compose down
```

## Repository Structure

```text
releaseops/
├── backend/
├── frontend/
├── deploy/
├── docs/
├── infra/
├── monitoring/
├── scripts/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── README.md
└── SECURITY.md
```

## Project Status

ReleaseOps is feature-complete for its current portfolio scope.

The project demonstrates a full application lifecycle from software development through containerization, CI/CD, cloud deployment, infrastructure as code, monitoring, security, rollback, backup, and disaster recovery.
