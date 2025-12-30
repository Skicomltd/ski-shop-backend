#!/bin/sh
set -e

echo "🚀 Starting API in $NODE_ENV mode"

# Wait for DB
echo "⏳ Waiting for database..."
until nc -z postgres 5432; do
  sleep 1
done

echo "✅ Database is ready"

if [ "$NODE_ENV" = "development" ]; then
  echo "🔥 DEV: Dropping & re-running migrations"
  npm run migration:drop
  npm run migration:migrate
else
  echo "⬆️ Running migrations"
  npm run migration:migrate
fi

echo "🎯 Starting server"
exec "$@"
