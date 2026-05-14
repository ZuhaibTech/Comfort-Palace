#!/bin/bash

# Database Backup Script for Inventory Artisans
# 
# This script creates timestamped backups of the SQLite database
# and optionally cleans up old backups.
#
# Usage:
#   ./backup-database.sh
#
# To run automatically (add to crontab):
#   0 2 * * * /path/to/backup-database.sh
#   (Runs daily at 2 AM)

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_FILE="${SCRIPT_DIR}/database.sqlite"
BACKUP_DIR="${SCRIPT_DIR}/backups"
DATE_FORMAT=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/database_${DATE_FORMAT}.sqlite"
KEEP_DAYS=30  # Keep backups for 30 days

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo -e "${GREEN}Created backup directory: ${BACKUP_DIR}${NC}"
fi

# Check if database file exists
if [ ! -f "$DB_FILE" ]; then
    echo -e "${RED}Error: Database file not found at ${DB_FILE}${NC}"
    exit 1
fi

# Create backup
echo "Creating backup..."
cp "$DB_FILE" "$BACKUP_FILE"

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup created successfully!${NC}"
    echo "  File: ${BACKUP_FILE}"
    echo "  Size: ${BACKUP_SIZE}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi

# Clean up old backups
echo "Cleaning up old backups (older than ${KEEP_DAYS} days)..."
DELETED_COUNT=0

if command -v find &> /dev/null; then
    # Using find command (more reliable)
    DELETED_COUNT=$(find "$BACKUP_DIR" -name "database_*.sqlite" -type f -mtime +${KEEP_DAYS} -delete -print | wc -l)
else
    # Fallback for systems without find
    for file in "$BACKUP_DIR"/database_*.sqlite; do
        if [ -f "$file" ]; then
            AGE_DAYS=$(( ($(date +%s) - $(stat -f %m "$file" 2>/dev/null || stat -c %Y "$file")) / 86400 ))
            if [ $AGE_DAYS -gt $KEEP_DAYS ]; then
                rm "$file"
                ((DELETED_COUNT++))
            fi
        fi
    done
fi

if [ $DELETED_COUNT -gt 0 ]; then
    echo -e "${YELLOW}Deleted ${DELETED_COUNT} old backup(s)${NC}"
else
    echo "No old backups to delete"
fi

# Show backup statistics
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "database_*.sqlite" -type f 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

echo ""
echo "Backup Summary:"
echo "  Total backups: ${TOTAL_BACKUPS}"
echo "  Total size: ${TOTAL_SIZE}"
echo ""
echo -e "${GREEN}Backup completed successfully!${NC}"



