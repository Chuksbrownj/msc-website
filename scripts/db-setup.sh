#!/usr/bin/env bash
# MSC Website — Local D1 Database Setup
# Creates the local database and runs migrations via wrangler.
#
# Usage: bash scripts/db-setup.sh

set -euo pipefail

DB_NAME="msc-website-db"
MIGRATIONS_DIR="db/migrations"

echo "🔧 MSC Website — Local D1 Setup"
echo "================================"

# Use npx wrangler (local dependency)
WRANGLER="npx wrangler"

# Local D1 databases are auto-created by wrangler when using --local.
# The database is stored in .wrangler/state/v3/d1/ automatically.
echo ""
echo "📦 Local D1 database will be auto-created on first migration."

# Run migrations
echo ""
echo "📄 Running migrations..."

if [ -d "$MIGRATIONS_DIR" ]; then
  for migration in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$migration" ]; then
      echo "   Running: $(basename "$migration")"
      $WRANGLER d1 execute "$DB_NAME" --local --file="$migration"
      echo "   ✅ Done"
    fi
  done
else
  echo "   ⚠️  No migrations directory found at $MIGRATIONS_DIR"
fi

echo ""
echo "🎉 Local D1 setup complete!"
echo ""
echo "Next steps:"
echo "  • Run tests: npm run test"
echo "  • Query data: npx wrangler d1 execute $DB_NAME --local --command 'SELECT * FROM contact_submissions'"
