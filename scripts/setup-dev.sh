#!/bin/bash
set -e

# GiftSync Development Setup Script
# This script sets up the local development environment with cost-effective services

echo "🎁 GiftSync Development Setup"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   - Mac: https://docs.docker.com/desktop/mac/install/"
    echo "   - Windows: https://docs.docker.com/desktop/windows/install/"
    echo "   - Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Determine docker compose command
if command -v docker-compose &> /dev/null; then
    DC_CMD="docker-compose"
else
    DC_CMD="docker compose"
fi

echo "✅ Docker is installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from development template..."
    cp .env.development .env
    echo "✅ Created .env file - you can customize it later"
else
    echo "✅ .env file already exists"
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p database/init
mkdir -p ml/models
mkdir -p ml/data
mkdir -p infrastructure/nginx
mkdir -p infrastructure/monitoring
mkdir -p backend/app/logs
mkdir -p web/public/uploads
echo "✅ Directories created"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
$DC_CMD down 2>/dev/null || true

# Pull latest images
echo "📥 Pulling Docker images..."
$DC_CMD pull

# Build custom images
echo "🔨 Building application containers..."
$DC_CMD build

# Start core services
echo "🚀 Starting core services (PostgreSQL, Redis, MinIO)..."
$DC_CMD up -d postgres redis minio

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check PostgreSQL
echo "🔍 Checking PostgreSQL connection..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if $DC_CMD exec postgres pg_isready -U giftsync >/dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ PostgreSQL failed to start after $max_attempts attempts"
        $DC_CMD logs postgres
        exit 1
    fi
    echo "   Attempt $attempt/$max_attempts - waiting for PostgreSQL..."
    sleep 2
    ((attempt++))
done

# Check Redis
echo "🔍 Checking Redis connection..."
if $DC_CMD exec redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis failed to start"
    $DC_CMD logs redis
    exit 1
fi

# Check MinIO
echo "🔍 Checking MinIO connection..."
attempt=1
while [ $attempt -le 15 ]; do
    if curl -f http://localhost:9000/minio/health/live >/dev/null 2>&1; then
        echo "✅ MinIO is ready"
        break
    fi
    if [ $attempt -eq 15 ]; then
        echo "❌ MinIO failed to start after 15 attempts"
        $DC_CMD logs minio
        exit 1
    fi
    echo "   Attempt $attempt/15 - waiting for MinIO..."
    sleep 2
    ((attempt++))
done

# Create MinIO bucket
echo "🪣 Creating MinIO bucket..."
$DC_CMD exec minio mc alias set local http://localhost:9000 giftsync giftsync_dev_password >/dev/null 2>&1 || true
$DC_CMD exec minio mc mb local/giftsync-dev >/dev/null 2>&1 || echo "   Bucket already exists"

# Set up database schema (if init scripts exist)
if [ -f "database/init/01_schema.sql" ]; then
    echo "🗄️  Setting up database schema..."
    $DC_CMD exec -T postgres psql -U giftsync -d giftsync_dev < database/init/01_schema.sql
    echo "✅ Database schema created"
fi

# Start backend service
echo "🚀 Starting backend API..."
$DC_CMD up -d backend

# Wait for backend to be ready
echo "⏳ Waiting for backend API..."
attempt=1
while [ $attempt -le 20 ]; do
    if curl -f http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ Backend API is ready"
        break
    fi
    if [ $attempt -eq 20 ]; then
        echo "⚠️  Backend API not responding - check logs with: $DC_CMD logs backend"
    fi
    echo "   Attempt $attempt/20 - waiting for backend..."
    sleep 3
    ((attempt++))
done

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available services:"
echo "   • PostgreSQL:     localhost:5432 (user: giftsync, db: giftsync_dev)"
echo "   • Redis:          localhost:6379"
echo "   • MinIO:          localhost:9000 (admin: localhost:9001)"
echo "   • Backend API:    localhost:8000"
echo "   • API Docs:       http://localhost:8000/docs"
echo ""
echo "🔧 Useful commands:"
echo "   • View logs:      $DC_CMD logs [service]"
echo "   • Stop all:       $DC_CMD down"
echo "   • Restart:        $DC_CMD restart [service]"
echo "   • Database shell: $DC_CMD exec postgres psql -U giftsync -d giftsync_dev"
echo "   • Redis shell:    $DC_CMD exec redis redis-cli"
echo ""
echo "📝 Next steps:"
echo "   1. Set up your external service accounts (see SETUP_REQUIREMENTS.md)"
echo "   2. Add API keys to .env file"
echo "   3. Test the API: curl http://localhost:8000/health"
echo ""
echo "🔗 MinIO Console: http://localhost:9001"
echo "   Username: giftsync"
echo "   Password: giftsync_dev_password"