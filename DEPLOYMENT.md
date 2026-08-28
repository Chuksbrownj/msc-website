# MSC Website — Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Cloudflare account (free tier)
- Node.js 18+

## Step 1: Cloudflare D1 Setup

### Create D1 Database

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **D1**
3. Click **Create database**
4. Name: `msc-website-db`
5. Choose **Recommended** location (or pick closest to your users)
6. Click **Create**

### Get Credentials

1. Go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Under **Account Resources**, select your account
5. Under **D1**, select `msc-website-db`
6. Click **Continue to summary** → **Create Token**
7. Copy the token (shown once)

### Get Database ID

1. Go to **Workers & Pages** → **D1** → `msc-website-db`
2. Copy the **Database ID** from the overview page

### Run Migration

```bash
# Set your credentials in .env.local first
cp .env.example .env.local
# Edit .env.local with your credentials

# Run migration against production D1
npm run db:migrate:remote
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
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | Production, Preview |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API Token | Production, Preview |
| `CLOUDFLARE_D1_DATABASE_ID` | Your D1 Database ID | Production, Preview |

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
- [ ] Valid submissions reach D1
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
| Local | `localhost:3000` | Local D1 (wrangler) | Any |
| Preview | `*.vercel.app` | Production D1 | Pull requests |
| Production | `your-domain.com` | Production D1 | `main` |

## Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Run `npm run build` locally to reproduce

### Contact form returns 500
- Check Vercel function logs
- Verify D1 credentials are correct
- Ensure migration has been run

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

### Cloudflare D1
- 5GB storage
- 100 million reads/day
- 50,000 writes/day

### Cloudflare (Free)
- Unlimited DNS queries
- DDoS protection
- SSL/TLS encryption
