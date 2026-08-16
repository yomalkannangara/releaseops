#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
BACKUP_FILE="$BACKUP_DIR/releaseops-$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating PostgreSQL backup..."

docker exec releaseops-postgres \
  pg_dump \
  -U releaseops \
  -d releaseops \
  | gzip > "$BACKUP_FILE"

echo "Backup created:"
echo "$BACKUP_FILE"