# MSC Website — Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Neon account (free tier)
- Node.js 18+

## Step 1: Neon Database Setup

### Create Project

1. Go to https://console.neon.tech
2. Sign up / log in
3. Click **Create Project**
4. Choose a project name (e.g., `msc-website`)
5. Select a region closest to your users
6. Click **Create Project**

### Get Connection String

1. In the project dashboard, go to **Connection Details**
2. Select **Connection string** tab
3. Copy the full `postgresql://...` URL
4. Make sure to use the **pooled** connection string (port 5432) for serverless environments like Vercel

### Run Migration

```bash
# Set your connection string in .env.local
cp .env.example .env.local
# Edit .env.local and paste your DATABASE_URL

# Run migration against Neon
npm run db:migrate
```

## Step 2: Vercel Setup

### Import Repository

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `Chuksbrownj/msc-website`
4. Click **Import**

### Configure Environment Variables

On the deploy screen, expand **Environment Variables** and add:

| Key | Value | Environments |
|-----|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview |

### Deploy

1. Click **Deploy**
2. Wait for build to complete (~1-2 minutes)
3. Click **Visit** to see your live site

## Step 3: Custom Domain (Optional)

### If using Cloudflare DNS:

1. Add your domain to Cloudflare (if not already)
2. In Vercel Dashboard → **Settings** → **Domains**
3. Add your domain (e.g., `msc.dev`)
4. Vercel will show you the DNS records to add
5. In Cloudflare, add a **CNAME** record:
   - Name: `@` (or subdomain)
   - Target: `cname.vercel-dns.com`
   - Proxy: **DNS-only** (gray cloud) — important for SSL
6. Wait for DNS propagation (5-30 minutes)
7. Vercel will automatically provision SSL certificate

### If using Vercel DNS:

1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your domain
3. Follow Vercel's instructions to update nameservers

## Step 4: Verification

After deployment, verify:

### Homepage
- [ ] Site loads at your domain
- [ ] All 10 sections render correctly
- [ ] Navigation smooth-scrolls to sections
- [ ] Mobile hamburger menu works
- [ ] Responsive at 320px, 375px, 768px, 1024px, 1440px

### Contact Form
- [ ] Form validates required fields
- [ ] Invalid email shows error
- [ ] Invalid service shows error
- [ ] Honeypot field is invisible to users
- [ ] Timing check rejects fast submissions
- [ ] Rate limiting works (5/IP/hour)

### Contact API
- [ ] `POST /api/contact` accepts valid JSON
- [ ] `POST /api/contact` rejects invalid data
- [ ] `POST /api/contact` returns 429 when rate limited
- [ ] `GET /api/contact` returns submissions list

### Database
- [ ] Valid submissions reach Neon
- [ ] Admin page shows submissions at `/admin`

### Security
- [ ] HTTPS works (no mixed content)
- [ ] Security headers present (check with curl or browser dev tools)
- [ ] No secrets appear in browser Network tab
- [ ] No `X-Powered-By` header

### Check Headers

```bash
curl -I https://your-domain.vercel.app
```

Expected headers:
- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `strict-transport-security: max-age=63072000`
- `content-security-policy: default-src 'self'...`
- No `x-powered-by` header

## Environment Separation

| Environment | URL | Database | Branch |
|-------------|-----|----------|--------|
| Local | `localhost:3000` | Neon (shared dev) | Any |
| Preview | `*.vercel.app` | Neon (same DB) | Pull requests |
| Production | `your-domain.com` | Neon (same DB) | `main` |

## Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure `DATABASE_URL` environment variable is set
- Run `npm run build` locally to reproduce

### Contact form returns 500
- Check Vercel function logs
- Verify `DATABASE_URL` is correct
- Ensure migration has been run: `npm run db:migrate`

### Rate limiting too aggressive
- In-memory rate limiter resets on cold starts
- For stricter limiting, consider Cloudflare or Upstash Redis
- Documented limitation in `lib/rate-limit.ts`

### CORS errors
- The API is same-origin (no CORS needed)
- If testing from external tools, ensure `Content-Type: application/json`

## Free Tier Limits

### Vercel (Hobby)
- 100GB bandwidth/month
- 1000 build minutes/month
- Serverless function execution included

### Neon (Free)
- 0.5 GB storage
- 24/7 compute (50 hours/month)
- 100 concurrent connections
- Autoscaling to zero when idle
