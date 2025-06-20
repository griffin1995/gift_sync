#!/bin/bash

# GiftSync Backend Start Script
# Handles both development and production environments

set -e

echo "🚀 Starting GiftSync Backend..."
echo "Environment: ${ENVIRONMENT:-production}"
echo "Port: ${PORT:-8000}"

# Set default values for production
export PYTHONPATH="${PYTHONPATH:-/app}"
export WORKERS="${WORKERS:-4}"

# Use PORT environment variable from Railway, fallback to 8000
PORT=${PORT:-8000}

# Start the application
if [ "${ENVIRONMENT}" = "development" ]; then
    echo "🔧 Starting in development mode with hot reload..."
    exec uvicorn app.main_api:app --host 0.0.0.0 --port $PORT --reload
else
    echo "🚀 Starting in production mode with ${WORKERS} workers..."
    exec uvicorn app.main_api:app --host 0.0.0.0 --port $PORT --workers $WORKERS
fi