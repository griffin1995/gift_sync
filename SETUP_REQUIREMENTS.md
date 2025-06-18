# GiftSync - Complete Setup Requirements

This is everything you need to set up and provide for the GiftSync project to be fully operational using cost-effective, industry-standard alternatives.

## 1. Local Development Setup (No Cloud Costs)

### Core Infrastructure (Docker-based):
- **PostgreSQL**: Local Docker container (cloud-ready)
- **Redis**: Local Docker container for caching
- **MinIO**: S3-compatible local object storage
- **Nginx**: Local reverse proxy and load balancer
- **ML Training**: Local PyTorch (can migrate to cloud later)

### Development Stack:
```yaml
# docker-compose.yml handles all infrastructure locally
services:
  postgres, redis, minio, nginx
  # Fully compatible with cloud equivalents
```

## 2. Free/Low-Cost Service Alternatives

### Essential Services (Start Free):
- **Supabase**: PostgreSQL + Auth + Storage (free tier: 500MB database, 1GB storage)
  - Alternative to Firebase + AWS RDS
  - Keys needed: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

- **Upstash**: Redis (free tier: 10K requests/day)
  - Alternative to AWS ElastiCache
  - Keys needed: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

- **Vercel**: Hosting + CDN (free tier: 100GB bandwidth)
  - Alternative to AWS CloudFront + S3
  - Automatic deployments from GitHub

### Analytics & Monitoring (Free Tiers):
- **PostHog**: User analytics (free tier: 1M events/month)
  - Alternative to Mixpanel
  - Self-hostable option available

- **Sentry**: Error monitoring (free tier: 5K errors/month)
  - Industry standard error tracking

### Affiliate APIs (Free to Start):
- **Amazon Product Advertising API**: Free with Associate account
- **eBay Partner Network**: Free affiliate program
- **Commission Junction**: Free to join

### Optional Paid Services (Can Add Later):
- **Stripe**: Payments (2.9% + 30¢ per transaction)
- **Resend**: Email delivery (free tier: 3K emails/month)
- **Twilio**: SMS notifications (pay-per-use)

## 3. Environment Configuration

### Development Environment (.env.dev):
```bash
# Local Database (Docker)
DATABASE_URL=postgresql://giftsync:password@localhost:5432/giftsync_dev
REDIS_URL=redis://localhost:6379

# API Configuration
API_BASE_URL=http://localhost:8000
SECRET_KEY=your-generated-secret-key-64-chars

# Free Tier Services
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Analytics (Free Tiers)
POSTHOG_API_KEY=your-posthog-key
SENTRY_DSN=your-sentry-dsn

# Affiliate APIs (Free)
AMAZON_ACCESS_KEY=your-amazon-access-key
AMAZON_SECRET_KEY=your-amazon-secret-key
AMAZON_ASSOCIATE_TAG=your-associate-tag
```

### Production Environment (.env.prod):
```bash
# Supabase Production
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Production API
API_BASE_URL=https://your-app.vercel.app
SECRET_KEY=your-production-secret-key

# Same external service keys as dev
```

## 4. Required Actions From You

### Immediate Setup (All Free):
1. **Install Docker** on your machine
2. **Create Supabase account** (free tier)
3. **Create Upstash account** (free tier)  
4. **Create Amazon Associates account** (free)
5. **Create PostHog account** (free tier)
6. **Create Sentry account** (free tier)

### Account Registrations Needed:
- [ ] Supabase (PostgreSQL + Auth)
- [ ] Upstash (Redis)
- [ ] Amazon Associates Program
- [ ] PostHog (Analytics)
- [ ] Sentry (Error monitoring)
- [ ] Vercel (Hosting - optional, can deploy later)

### Development Prerequisites:
- [ ] Docker installed
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] Git configured

## 5. Cost Breakdown (Much More Affordable)

### Development Costs:
- **Local Development**: $0/month (Docker containers)
- **Domain**: ~$12/year (optional initially)
- **Total Development**: ~$1/month

### Production Costs (Free Tiers):
- **Supabase**: Free up to 500MB database
- **Upstash**: Free up to 10K Redis requests/day
- **Vercel**: Free up to 100GB bandwidth
- **PostHog**: Free up to 1M events/month
- **Sentry**: Free up to 5K errors/month
- **Total**: $0/month until you exceed free tiers

### When You Outgrow Free Tiers:
- **Supabase Pro**: $25/month (unlimited database)
- **Upstash**: $0.20 per 100K requests
- **PostHog**: $0.00031 per event after 1M
- **Total at 50K users**: ~$50-100/month

## 6. Migration Path to Cloud (Future)

### Easy Migration Strategy:
- **Current Setup**: Fully containerized and cloud-agnostic
- **Supabase → AWS RDS**: Database migration tools available
- **Upstash → AWS ElastiCache**: Redis export/import
- **Vercel → AWS**: Container deployment to EKS
- **Docker Compose → Kubernetes**: Automated conversion tools

### When to Consider Migration:
- Exceeding free tier limits
- Need advanced scaling features
- Require enterprise compliance
- Want more control over infrastructure

## 7. Next Steps After Setup

Once you provide the free service accounts:
1. I'll configure all environment files
2. Update Docker Compose for local development
3. Set up CI/CD with GitHub Actions (free)
4. Configure monitoring and alerting
5. Deploy to Vercel (free tier)
6. Test end-to-end functionality

## 8. Immediate Priority Items

**Highest Priority (can do today):**
1. Install Docker on your machine
2. Create Supabase account
3. Create Amazon Associates account

**Medium Priority (this week):**
1. Set up remaining free service accounts
2. Configure environment variables
3. Test local development environment

**Can be done later:**
1. Domain registration
2. Production deployment
3. Advanced monitoring setup

---

**Next Action Required**: 
1. ✅ Install Docker (Done)
2. Create Supabase account at https://supabase.com
3. Create Amazon Associates account at https://affiliate-program.amazon.com
4. **Set up Cloudflare Pages** for giftsync.jackgriffin.dev deployment

**Deployment Options:**
- **Development**: Local Docker (localhost:8000) - ✅ Working
- **Staging**: Cloudflare Pages (giftsync.jackgriffin.dev) - See CLOUDFLARE_DEPLOYMENT.md
- **Production**: Custom domain (future) - Easy migration path

**Total upfront cost**: $0 (everything is free to start)