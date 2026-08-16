#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"
CONTAINER="releaseops-postgres"
DB_NAME="releaseops"
DB_USER="releaseops"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "Restoring PostgreSQL database from:"
echo "$BACKUP_FILE"

echo "Terminating existing database connections..."

docker exec "$CONTAINER" \
  psql -U "$DB_USER" -d postgres \
  -v ON_ERROR_STOP=1 \
  -c "SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '$DB_NAME'
      AND pid <> pg_backend_pid();"

echo "Dropping existing database..."

docker exec "$CONTAINER" \
  dropdb -U "$DB_USER" --if-exists "$DB_NAME"

echo "Creating clean database..."

docker exec "$CONTAINER" \
  createdb -U "$DB_USER" "$DB_NAME"

echo "Restoring backup..."

gunzip -c "$BACKUP_FILE" |
  docker exec -i "$CONTAINER" \
  psql \
  -v ON_ERROR_STOP=1 \
  -U "$DB_USER" \
  -d "$DB_NAME"

echo "Restore completed successfully."