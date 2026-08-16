# ReleaseOps Architecture

## Overview

ReleaseOps is a production-style service, incident, and deployment management platform.

It combines a React frontend, Spring Boot backend, PostgreSQL database, Docker-based deployment, GitHub Actions CI/CD, Oracle Cloud infrastructure, monitoring, and automated recovery.

## High-Level Architecture

```text
Internet
   |
   v
Caddy / HTTPS
   |
   +----------------------+
   |                      |
   v                      v
React Frontend        Grafana
   |
   v
Spring Boot API
   |
   v
PostgreSQL

Spring Boot ---> Prometheus
Host ---------> Node Exporter
Prometheus ---> Grafana
```

## Application Components

### Frontend

Technology:

* React
* TypeScript

Responsibilities:

* authentication UI
* dashboard
* service management
* incident management
* deployment history
* administrative views

### Backend

Technology:

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Flyway

Architecture:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

The backend exposes REST APIs and handles validation, authentication, authorization, business logic, persistence, and application health endpoints.

### Database

PostgreSQL stores:

* users
* services
* incidents
* deployments
* audit logs

Flyway manages schema migrations.

## Authentication and Authorization

ReleaseOps uses JWT authentication.

The backend validates JWTs through Spring Security and applies role-based authorization.

Application roles control access to protected operations.

Passwords are stored as secure password hashes rather than plaintext.

## Container Architecture

The production platform runs with Docker Compose.

Main containers:

* frontend
* backend
* PostgreSQL
* Caddy
* Prometheus
* Grafana
* Node Exporter

All internal services communicate through the private Docker network.

Only the reverse proxy exposes public application ports.

## Production Network

```text
Internet
   |
   | 80 / 443
   v
Caddy
   |
   +--> frontend
   |
   +--> Grafana

frontend
   |
   v
backend
   |
   v
PostgreSQL
```

PostgreSQL is not directly exposed to the public internet.

## CI/CD Architecture

```text
git push
   |
   v
GitHub Actions CI
   |
   +--> Backend tests
   +--> Frontend checks
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
   +--> record deployment start
   +--> connect to OCI over SSH
   +--> deploy exact commit images
   +--> health check
   +--> rollback if deployment fails
   +--> update ReleaseOps deployment record
```

## Cloud Infrastructure

Production infrastructure runs on Oracle Cloud Infrastructure.

Terraform represents:

* Virtual Cloud Network
* public subnet
* internet gateway
* route table
* security rules
* compute instance
* DHCP options

Terraform state is kept outside Git.

## Monitoring

Prometheus collects:

* Spring Boot application metrics
* host metrics from Node Exporter

Grafana visualizes the collected metrics.

Spring Boot Actuator exposes application health and Prometheus-compatible metrics.

## Deployment Recovery

Deployments use immutable Git commit SHA image tags.

If the new deployment fails its health check, the deployment script attempts to restore the previous working image version.

ReleaseOps records the deployment result as success, failure, or rollback.

## Database Recovery

PostgreSQL backups are created using `pg_dump`.

Backup files are timestamped and compressed.

The recovery process recreates the database and restores the selected dump.

The restore procedure has been tested by deleting data and successfully recovering it from a backup.

## Security

Security controls include:

* JWT authentication
* RBAC
* password hashing
* HTTPS
* secure HTTP headers
* private production database networking
* GitHub Actions secrets
* environment-based configuration
* Trivy vulnerability scanning
* SSH deployment keys
* automated health verification
* tested database backups
* deployment rollback
