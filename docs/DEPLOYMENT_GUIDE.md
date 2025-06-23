# GiftSync Deployment Guide

## Overview

This guide covers all deployment scenarios for the GiftSync platform, from local development to production environments. GiftSync consists of a FastAPI backend and Next.js frontend, designed for scalable deployment across multiple platforms.

## Prerequisites

### Required Tools
- **Docker & Docker Compose**: Containerization
- **Node.js 18+**: Frontend development
- **Python 3.11+**: Backend development
- **Git**: Version control
- **PostgreSQL**: Database (or Supabase)
- **Redis**: Caching (optional but recommended)

### Required Accounts
- **Supabase**: Database and authentication
- **Amazon Associates**: Affiliate program
- **PostHog**: Analytics (optional)
- **Sentry**: Error tracking (optional)
- **Vercel/AWS/GCP**: Hosting platform

## Environment Configuration

### Environment Variables

Create `.env` files for each environment:

#### Backend (`backend/.env`)
```bash
# Core Configuration
PROJECT_NAME=GiftSync API
VERSION=1.0.0
ENVIRONMENT=production
DEBUG=false

# Security
SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Optional: Direct PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/giftsync

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# External Services
AMAZON_ASSOCIATE_TAG=giftsync-21
AMAZON_ACCESS_KEY=your-amazon-api-key
AMAZON_SECRET_KEY=your-amazon-secret-key

# Analytics
MIXPANEL_TOKEN=your-mixpanel-token
SENTRY_DSN=your-sentry-dsn

# Email (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password

# CORS
ALLOWED_HOSTS=https://your-frontend-domain.com,https://app.giftsync.com

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_SOCIAL_LOGIN=true
ENABLE_ML_RECOMMENDATIONS=true
ENABLE_AFFILIATE_TRACKING=true

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=100
```

#### Frontend (`web/.env.local`)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.giftsync.com
NEXT_PUBLIC_WEB_URL=https://app.giftsync.com

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Amazon Affiliate
NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG=giftsync-21
NEXT_PUBLIC_AMAZON_REGION=uk

# Build Configuration
BUILD_STANDALONE=false
NODE_ENV=production
```

## Local Development

### Quick Start with Docker Compose

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/giftsync.git
cd giftsync
```

2. **Create environment files:**
```bash
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local
# Edit with your configuration
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Verify services:**
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

### Manual Development Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if using direct PostgreSQL)
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Database Setup (Supabase)
1. Create new Supabase project
2. Copy connection details to `.env`
3. Run database setup scripts:
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    subscription_tier VARCHAR DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'GBP',
    category VARCHAR,
    brand VARCHAR,
    image_url VARCHAR,
    affiliate_url VARCHAR,
    asin VARCHAR,
    rating DECIMAL(2,1),
    review_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Affiliate clicks table
CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    product_id VARCHAR,
    affiliate_url VARCHAR NOT NULL,
    clicked_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR,
    referrer VARCHAR
);
```

## Production Deployment

### Vercel Deployment (Recommended for Frontend)

#### Prerequisites
```bash
npm install -g vercel
vercel login
```

#### Deployment Steps
```bash
cd web

# Build and deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_POSTHOG_KEY production
# ... add all environment variables
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.giftsync.com/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.giftsync.com"
  }
}
```

### AWS Deployment

#### Backend on AWS ECS

1. **Build and push Docker image:**
```bash
cd backend

# Build image
docker build -t giftsync-api .

# Tag for ECR
docker tag giftsync-api:latest your-account.dkr.ecr.region.amazonaws.com/giftsync-api:latest

# Push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker push your-account.dkr.ecr.region.amazonaws.com/giftsync-api:latest
```

2. **ECS Task Definition (`ecs-task-definition.json`):**
```json
{
  "family": "giftsync-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "giftsync-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/giftsync-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "SECRET_KEY",
          "valueFrom": "arn:aws:ssm:region:account:parameter/giftsync/secret-key"
        },
        {
          "name": "SUPABASE_SERVICE_KEY",
          "valueFrom": "arn:aws:ssm:region:account:parameter/giftsync/supabase-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/giftsync-api",
          "awslogs-region": "region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

3. **Deploy with ECS:**
```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Update service
aws ecs update-service --cluster giftsync-cluster --service giftsync-api-service --task-definition giftsync-api:latest
```

#### Frontend on S3 + CloudFront

1. **Build static export:**
```bash
cd web

# Configure for static export
echo "output: 'export'" >> next.config.js

# Build
npm run build

# Upload to S3
aws s3 sync out/ s3://giftsync-frontend-bucket --delete
```

2. **CloudFront Configuration:**
```json
{
  "Origins": [
    {
      "Id": "S3-giftsync-frontend",
      "DomainName": "giftsync-frontend-bucket.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/E123456789"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-giftsync-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponsePagePath": "/404.html",
      "ResponseCode": "404"
    }
  ]
}
```

### Google Cloud Deployment

#### Backend on Cloud Run

1. **Build and deploy:**
```bash
cd backend

# Build and submit to Cloud Build
gcloud builds submit --tag gcr.io/PROJECT_ID/giftsync-api

# Deploy to Cloud Run
gcloud run deploy giftsync-api \
  --image gcr.io/PROJECT_ID/giftsync-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production \
  --set-env-vars DATABASE_URL=$DATABASE_URL
```

2. **Cloud Run Configuration (`cloudbuild.yaml`):**
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/giftsync-api', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/giftsync-api']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'giftsync-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/giftsync-api'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### DigitalOcean App Platform

1. **App Specification (`.do/app.yaml`):**
```yaml
name: giftsync
services:
  - name: api
    source_dir: backend/
    github:
      repo: your-org/giftsync
      branch: main
    run_command: uvicorn app.main:app --host 0.0.0.0 --port 8080
    environment_slug: python
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: ENVIRONMENT
        value: production
      - key: SECRET_KEY
        value: ${SECRET_KEY}
        type: SECRET
    health_check:
      http_path: /health
  - name: web
    source_dir: web/
    github:
      repo: your-org/giftsync
      branch: main
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NEXT_PUBLIC_API_URL
        value: ${api.PUBLIC_URL}
databases:
  - name: giftsync-db
    engine: PG
    version: "13"
    size: basic-xs
```

2. **Deploy:**
```bash
doctl apps create --spec .do/app.yaml
```

## Docker Production Deployment

### Multi-stage Dockerfile

#### Backend (`backend/Dockerfile`)
```dockerfile
# Build stage
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend (`web/Dockerfile`)
```dockerfile
# Dependencies stage
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose Production

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/giftsync
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=giftsync
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```

## Database Migrations

### Alembic Setup (if using direct PostgreSQL)

```bash
cd backend

# Initialize migrations
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Supabase Migrations

Use Supabase CLI for schema changes:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init

# Create migration
supabase migration new create_users_table

# Apply migrations
supabase db push
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name api.giftsync.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.giftsync.com;

    ssl_certificate /etc/letsencrypt/live/api.giftsync.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.giftsync.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    location / {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Certificate Auto-renewal

```bash
# Crontab entry
0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring & Logging

### Application Monitoring

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"

  promtail:
    image: grafana/promtail
    volumes:
      - /var/log:/var/log:ro
      - ./promtail.yml:/etc/promtail/promtail.yml
```

### Log Aggregation

```bash
# Centralized logging with ELK stack
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  elasticsearch:8.0.0

docker run -d \
  --name kibana \
  -p 5601:5601 \
  --link elasticsearch:elasticsearch \
  kibana:8.0.0
```

## Backup & Recovery

### Database Backups

```bash
# Automated PostgreSQL backups
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_${DATE}.sql
aws s3 cp backup_${DATE}.sql s3://giftsync-backups/
rm backup_${DATE}.sql
```

### Application Backups

```bash
# Code and configuration backup
#!/bin/bash
tar -czf giftsync_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=__pycache__ \
  /path/to/giftsync

aws s3 cp giftsync_$(date +%Y%m%d).tar.gz s3://giftsync-backups/
```

## Scaling Considerations

### Horizontal Scaling

- **Load Balancer**: Distribute traffic across multiple instances
- **Container Orchestration**: Kubernetes or Docker Swarm
- **Database Replication**: Read replicas for performance
- **CDN**: Global content delivery

### Performance Optimization

- **Caching**: Redis for API responses and sessions
- **Database Indexing**: Optimize query performance
- **Image Optimization**: WebP conversion and compression
- **Code Splitting**: Reduce bundle sizes

## Security Checklist

### Production Security

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/TLS everywhere
- [ ] Configure proper CORS headers
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] API key rotation
- [ ] Access logging and monitoring
- [ ] Backup encryption

### Environment Security

- [ ] Use environment variables for secrets
- [ ] Restrict database access
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Use least privilege access
- [ ] Regular penetration testing
- [ ] Vulnerability scanning
- [ ] Dependency security checks

## Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Check connectivity
pg_isready -h host -p 5432 -U user

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Memory Issues:**
```bash
# Check container memory usage
docker stats

# Increase memory limits
docker run -m 1g your-image
```

**SSL Certificate Issues:**
```bash
# Test SSL configuration
openssl s_client -connect domain.com:443

# Renew Let's Encrypt certificates
certbot renew
```

### Health Checks

```bash
# API health check
curl -f http://localhost:8000/health

# Frontend health check
curl -f http://localhost:3000/api/health

# Database health check
pg_isready -h localhost -p 5432
```

This deployment guide provides comprehensive instructions for deploying GiftSync in various environments. Choose the deployment method that best fits your infrastructure requirements and scaling needs.