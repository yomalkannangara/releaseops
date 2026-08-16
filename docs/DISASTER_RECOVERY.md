# ReleaseOps Disaster Recovery

## Overview

ReleaseOps includes database backup, restoration, deployment rollback, and infrastructure recovery procedures.

The objective is to recover from common failures such as:

* accidental database data loss
* database corruption
* failed application deployments
* damaged application containers
* infrastructure configuration loss

## PostgreSQL Backup

Database backups are created using:

```text
scripts/backup-db.sh
```

The script uses PostgreSQL `pg_dump` and compresses the output using gzip.

Backups are stored with timestamped filenames:

```text
backups/releaseops-YYYYMMDD-HHMMSS.sql.gz
```

Example:

```text
backups/releaseops-20260816-235248.sql.gz
```

## Creating a Backup

From the ReleaseOps project directory:

```bash
./scripts/backup-db.sh
```

Verify the backup:

```bash
ls -lh backups/
```

The compressed file can also be checked with:

```bash
gzip -t backups/<backup-file>.sql.gz
```

## Database Restore

Restore using:

```bash
./scripts/restore-db.sh backups/<backup-file>.sql.gz
```

The restore procedure:

1. Validates that the backup file exists.
2. Terminates active connections to the ReleaseOps database.
3. Drops the existing ReleaseOps database.
4. Creates a clean database.
5. Restores the selected backup.
6. Stops immediately if PostgreSQL reports an error.

The restore command uses:

```text
ON_ERROR_STOP
```

so database errors cause the operation to fail instead of incorrectly reporting a successful restore.

## Recommended Restore Procedure

Stop the backend first:

```bash
docker compose stop backend
```

Restore the database:

```bash
./scripts/restore-db.sh backups/<backup-file>.sql.gz
```

Start the backend again:

```bash
docker compose start backend
```

Verify:

```bash
docker compose ps backend
```

## Tested Recovery Scenario

The ReleaseOps restore process was tested using real database data.

The test procedure was:

1. Insert a temporary service named `DR Test Service`.
2. Create a fresh PostgreSQL backup.
3. Delete `DR Test Service`.
4. Confirm the service no longer existed.
5. Restore the database from the backup.
6. Query the database again.
7. Confirm that `DR Test Service` had been recovered.

This verifies that ReleaseOps backups are not only created but can actually be restored.

## Important Restore Behavior

A full PostgreSQL dump should not be restored directly into an already populated database.

Doing so can produce errors such as:

```text
relation already exists
duplicate key value
multiple primary keys are not allowed
```

ReleaseOps therefore restores into a freshly recreated database.

## Deployment Recovery

Application deployments also have a separate recovery mechanism.

If a newly deployed version fails its health verification, the deployment process attempts to restore the previous working Docker image version.

```text
Previous healthy release
        |
        v
Deploy new release
        |
        v
Health check
   /           \
PASS           FAIL
 |              |
SUCCESS      Rollback
                |
                v
       Previous healthy release
```

## Infrastructure Recovery

OCI infrastructure is represented using Terraform.

Terraform manages the ReleaseOps:

* VCN
* subnet
* internet gateway
* route table
* security rules
* compute instance
* DHCP configuration

The infrastructure configuration can be validated using:

```bash
terraform fmt
terraform validate
terraform plan
```

Terraform state files are not committed to Git.

## Recovery Verification

After database recovery, verify:

```bash
docker compose ps
```

Then test:

```bash
curl https://releaseops-yk.duckdns.org/health
```

Also verify:

* user authentication
* services
* incidents
* deployments
* monitoring
* recent database records

## Backup Safety

Backup files can contain sensitive production data.

They should:

* not be committed to Git
* be protected from unauthorized access
* be stored outside the production server for stronger disaster protection
* eventually follow a defined retention policy

## Current Scope

The current ReleaseOps implementation demonstrates tested local database restoration and automated deployment rollback.

For a larger production system, additional improvements could include:

* remote encrypted backups
* automated scheduled backup retention
* multiple geographic backup copies
* recovery point objectives
* recovery time objectives
* periodic automated recovery drills
