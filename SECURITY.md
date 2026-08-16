# ReleaseOps Security Policy

## Overview

ReleaseOps is a production-style service, incident, and deployment management platform built with Spring Boot, React, PostgreSQL, Docker, GitHub Actions, and Oracle Cloud Infrastructure.

Security is implemented across the application, CI/CD pipeline, containers, network, and production environment.

## Security Controls

ReleaseOps currently includes:

* JWT-based authentication
* Role-based access control (RBAC)
* Password hashing
* HTTPS for production traffic
* Automatic HTTP-to-HTTPS redirection
* Environment-based secrets
* Private PostgreSQL networking in production
* Trivy vulnerability scanning in CI
* Docker container isolation
* Secure HTTP response headers
* GitHub Actions environment secrets
* SSH-based production deployment
* Application health checks before deployment completion
* Automatic deployment rollback
* PostgreSQL backup and tested disaster recovery

## Authentication and Authorization

The backend uses Spring Security with JWT authentication.

Users authenticate through the ReleaseOps API and receive a signed JWT. Protected endpoints require a valid token.

Authorization is controlled through application roles so users can only perform actions permitted for their role.

Passwords are stored as password hashes and are never stored in plaintext.

## Secrets Management

Production secrets must not be committed to Git.

Sensitive values such as:

* database passwords
* JWT secrets
* deployment SSH keys
* deployment credentials
* Grafana administrator passwords

are provided through environment variables or GitHub Actions secrets.

Terraform state files, Terraform variable files, environment files, and other local secret-containing files are excluded from source control where appropriate.

## Network Security

Production PostgreSQL is not exposed directly to the public internet.

The database is accessible only through the internal Docker network used by the ReleaseOps backend.

Public application traffic enters through the production reverse proxy over:

* HTTP port 80
* HTTPS port 443

HTTP traffic is redirected to HTTPS.

## HTTP Security Headers

The production reverse proxy configures security-related HTTP headers including:

* `X-Content-Type-Options`
* `X-Frame-Options`
* `Referrer-Policy`
* `Strict-Transport-Security`
* `Permissions-Policy`

These reduce exposure to common browser-based attacks and unsafe content handling.

## CI/CD Security

The GitHub Actions CI pipeline runs automated validation before production deployment.

The pipeline includes:

1. Backend tests
2. Frontend linting and build checks
3. Trivy vulnerability scanning
4. Docker image build validation
5. Docker image publishing
6. Production deployment
7. Production health verification

Trivy scans the repository for high and critical vulnerabilities. Security scan failures prevent the normal CI pipeline from continuing to deployment.

Production deployment credentials are stored using GitHub secrets rather than directly inside workflow files.

## Deployment Security

Production deployments are performed over SSH using a dedicated deployment key.

The deployment pipeline deploys an exact Git commit rather than depending only on a mutable `latest` image tag.

After deployment, ReleaseOps performs health checks.

If a deployment fails, the deployment process attempts to restore the previous working version.

## Database Backup and Recovery

PostgreSQL backups are created using `pg_dump` and stored as compressed timestamped backup files.

The restore procedure:

1. Stops application database access
2. Terminates remaining database connections
3. Recreates the database
4. Restores the selected backup
5. Fails immediately if PostgreSQL reports a restore error

The recovery process has been tested by:

1. Creating test data
2. Taking a backup
3. Deleting the test data
4. Restoring the backup
5. Confirming that the deleted data was recovered

## Infrastructure Security

Oracle Cloud infrastructure is represented using Terraform.

The Terraform configuration manages the ReleaseOps network, subnet, routing, security rules, internet gateway, and compute instance.

Terraform state files and environment-specific variable files are excluded from Git source control.

## Vulnerability Reporting

If you discover a security vulnerability in ReleaseOps, do not publish sensitive exploit details publicly.

Report the issue privately to the repository owner with:

* a description of the vulnerability
* affected component
* reproduction steps
* potential impact
* recommended remediation, if known

Please avoid accessing or modifying data that does not belong to you while testing a suspected vulnerability.

## Scope

ReleaseOps is a portfolio and learning project designed to demonstrate practical software engineering and DevOps security practices.

The project is not intended to represent a formally audited or compliance-certified production system.
