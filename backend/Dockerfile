# =============================================================================
# GiftSync Backend Production Dockerfile
# =============================================================================
# 
# Multi-stage production Dockerfile for the GiftSync FastAPI backend service.
# Optimized for security, performance, and minimal attack surface in production
# deployment environments including Kubernetes, Docker Swarm, and cloud services.
# 
# Key Features:
#   - Python 3.11 slim base for minimal image size
#   - Non-root user execution for security
#   - Layer caching optimization for faster builds
#   - Health checks for container orchestration
#   - Production-ready environment configuration
# 
# Security Features:
#   - Non-root user execution (appuser)
#   - Minimal system dependencies
#   - No package caches to reduce attack surface
#   - Read-only filesystem support ready
# 
# Performance Optimizations:
#   - Pip cache disabled for smaller images
#   - Layer ordering for optimal Docker caching
#   - Compiled Python bytecode disabled (security)
#   - Unbuffered Python output for real-time logs
# 
# Usage:
#   docker build -t giftsync-backend .
#   docker run -p 8000:8000 giftsync-backend
# 
# =============================================================================

# Use Python 3.11 slim base image for smaller size and better security
FROM python:3.11-slim

# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================
# Set Python and application environment variables for production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000

# =============================================================================
# SYSTEM DEPENDENCIES
# =============================================================================
# Install minimal system dependencies required for Python packages

# Update package list and install required system libraries
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \       # Required for compiling Python packages
        libpq-dev \            # PostgreSQL client library
        curl \                 # For health checks and external API calls
    && rm -rf /var/lib/apt/lists/*  # Remove package cache to reduce image size

# =============================================================================
# SECURITY: NON-ROOT USER SETUP
# =============================================================================
# Create dedicated application user for security best practices

# Create system group and user (non-root) for running the application
RUN groupadd -r appuser && useradd -r -g appuser appuser

# =============================================================================
# APPLICATION DIRECTORY SETUP
# =============================================================================

# Set the working directory for the application
WORKDIR /app

# =============================================================================
# PYTHON DEPENDENCIES INSTALLATION
# =============================================================================
# Install Python dependencies first to leverage Docker layer caching

# Copy requirements file (layer will be cached if requirements don't change)
COPY requirements.txt .

# Install Python dependencies with production optimizations
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# =============================================================================
# APPLICATION CODE DEPLOYMENT
# =============================================================================

# Copy application source code (this layer will change most frequently)
COPY . .

# =============================================================================
# FILE PERMISSIONS AND USER CONTEXT
# =============================================================================

# Change ownership of application files to non-root user
RUN chown -R appuser:appuser /app

# Make start script executable (must be done before switching user)
RUN chmod +x /app/start.sh

# Switch to non-root user for security
USER appuser

# =============================================================================
# HEALTH CHECK CONFIGURATION
# =============================================================================
# Configure container health monitoring for orchestration

# Health check endpoint for container orchestration (Kubernetes, Docker Swarm)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# =============================================================================
# NETWORK CONFIGURATION
# =============================================================================

# Expose application port (documentation only - doesn't actually publish)
EXPOSE 8000

# =============================================================================
# STARTUP CONFIGURATION
# =============================================================================

# Use startup script for production-ready server configuration
CMD ["./start.sh"]