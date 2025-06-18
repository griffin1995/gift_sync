#!/bin/bash
set -e

# GiftSync Development Setup Script
# This script sets up the local development environment with cost-effective services

echo "🎁 GiftSync Development Setup"
echo "=============================="

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

install_python_deps() {
    log_info "Setting up Python virtual environment..."
    
    cd "$PROJECT_DIR/backend"
    
    # Create virtual environment if it doesn't exist
    if [[ ! -d "venv" ]]; then
        python3 -m venv venv
        log_success "Created Python virtual environment"
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    log_success "Python dependencies installed"
}

setup_environment_files() {
    log_info "Setting up environment files..."
    
    # Backend .env file
    BACKEND_ENV_FILE="$PROJECT_DIR/backend/.env"
    if [[ ! -f "$BACKEND_ENV_FILE" ]]; then
        cat > "$BACKEND_ENV_FILE" << EOF
# Development Environment Configuration
ENVIRONMENT=development
DEBUG=true

# Database
DATABASE_URL=postgresql://giftsync:giftsync_dev_password@localhost:5432/giftsync_dev

# Redis
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS (LocalStack for development)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=eu-west-2
S3_BUCKET_NAME=giftsync-assets-dev

# External APIs
MIXPANEL_TOKEN=your-mixpanel-token
AMAZON_ASSOCIATE_TAG=your-amazon-tag

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_SOCIAL_LOGIN=true
ENABLE_ML_RECOMMENDATIONS=true

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
EOF
        log_success "Created backend .env file"
    else
        log_info "Backend .env file already exists"
    fi
    
    # Mobile .env file
    MOBILE_ENV_FILE="$PROJECT_DIR/mobile/.env"
    if [[ ! -f "$MOBILE_ENV_FILE" ]]; then
        cat > "$MOBILE_ENV_FILE" << EOF
# Mobile App Configuration
API_BASE_URL=http://localhost:8000
MIXPANEL_TOKEN=your-mixpanel-token
FIREBASE_PROJECT_ID=giftsync-dev
EOF
        log_success "Created mobile .env file"
    else
        log_info "Mobile .env file already exists"
    fi
}

start_services() {
    log_info "Starting development services..."
    
    cd "$PROJECT_DIR"
    
    # Start services with Docker Compose
    docker-compose up -d postgres redis localstack
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "postgres.*Up"; then
        log_success "PostgreSQL is running"
    else
        log_error "PostgreSQL failed to start"
    fi
    
    if docker-compose ps | grep -q "redis.*Up"; then
        log_success "Redis is running"
    else
        log_error "Redis failed to start"
    fi
    
    if docker-compose ps | grep -q "localstack.*Up"; then
        log_success "LocalStack is running"
    else
        log_error "LocalStack failed to start"
    fi
}

run_database_migrations() {
    log_info "Running database migrations..."
    
    cd "$PROJECT_DIR/backend"
    source venv/bin/activate
    
    # Generate initial migration
    alembic revision --autogenerate -m "Initial migration"
    
    # Run migrations
    alembic upgrade head
    
    log_success "Database migrations completed"
}

setup_flutter_project() {
    log_info "Setting up Flutter project..."
    
    cd "$PROJECT_DIR/mobile"
    
    # Get Flutter dependencies
    flutter pub get
    
    # Generate code
    flutter packages pub run build_runner build
    
    log_success "Flutter project setup completed"
}

print_next_steps() {
    log_success "Development environment setup completed!"
    echo
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Start the backend API:"
    echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
    echo
    echo "2. Start the Flutter app:"
    echo "   cd mobile && flutter run"
    echo
    echo "3. Access the API documentation:"
    echo "   http://localhost:8000/docs"
    echo
    echo "4. View running services:"
    echo "   docker-compose ps"
    echo
    echo "5. View logs:"
    echo "   docker-compose logs -f [service-name]"
    echo
    echo -e "${BLUE}Useful commands:${NC}"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- View API logs: docker-compose logs -f backend"
    echo "- Access database: docker-compose exec postgres psql -U giftsync -d giftsync_dev"
    echo
}

main() {
    log_info "Setting up $PROJECT_NAME development environment..."
    echo
    
    # Check prerequisites
    log_info "Checking prerequisites..."
    
    MISSING_DEPS=()
    
    if ! check_command "python3"; then
        MISSING_DEPS+=("python3")
    fi
    
    if ! check_command "pip3"; then
        MISSING_DEPS+=("pip3")
    fi
    
    if ! check_command "curl"; then
        MISSING_DEPS+=("curl")
    fi
    
    if ! check_command "git"; then
        MISSING_DEPS+=("git")
    fi
    
    # Install Docker if not present
    if ! check_command "docker"; then
        if [[ "${1:-}" == "--install-docker" ]]; then
            install_docker
        else
            MISSING_DEPS+=("docker")
        fi
    fi
    
    if ! check_command "docker-compose" && ! docker compose version >/dev/null 2>&1; then
        MISSING_DEPS+=("docker-compose")
    fi
    
    if [[ ${#MISSING_DEPS[@]} -gt 0 ]]; then
        log_error "Missing dependencies: ${MISSING_DEPS[*]}"
        echo
        echo "Please install the missing dependencies and run this script again."
        echo "To automatically install Docker, run: $0 --install-docker"
        exit 1
    fi
    
    # Install Flutter if not present
    if ! check_command "flutter"; then
        install_flutter
    fi
    
    # Setup project
    setup_environment_files
    install_python_deps
    start_services
    run_database_migrations
    setup_flutter_project
    
    print_next_steps
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--install-docker] [--help]"
        echo
        echo "Options:"
        echo "  --install-docker  Automatically install Docker"
        echo "  --help, -h        Show this help message"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac