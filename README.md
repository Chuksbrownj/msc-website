# MSC Website

A one-page corporate website for MSC — a software engineering company focused on AI automation, custom software, and full-stack development.

## Architecture

```
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                              HTTPS
                                │
                                ▼
                         ┌──────────────┐
                         │   Vercel     │
                         │              │
                         │   Next.js    │
                         │              │
                         │  Frontend    │
                         │      │       │
                         │      ▼       │
                         │ Contact API  │
                         └──────┬───────┘
                                │
                       Server-side access
                                │
                                ▼
                         ┌──────────────┐
                         │  Cloudflare  │
                         │     D1       │
                         └──────────────┘
```

- Browser never connects directly to D1
- API accesses database server-side only
- Secrets remain in Vercel environment variables
- HTTPS everywhere

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Hosting | Vercel |
| Database | Cloudflare D1 |
| DNS | Cloudflare (optional) |

## Features

- **10 sections**: Navbar, Hero, Services, Solutions, Process, Technologies, About, CTA, Contact, Footer
- **Responsive design**: 320px → 1440px, no horizontal scroll
- **Accessibility**: WCAG 2.2 AA — semantic HTML, keyboard navigation, focus states, reduced-motion support, skip-to-content link, aria-live form errors
- **SEO**: Open Graph, Twitter cards, JSON-LD structured data, canonical URL, robots.txt, sitemap.xml
- **Contact API**: POST /api/contact with Zod validation, D1 storage
- **Admin dashboard**: /admin to view all submissions
- **Security**: Rate limiting (5/IP/hour), honeypot, timing checks, CSP, HSTS, XSS/SQL injection prevention
- **91 passing tests** (component, API, security, validation)

## Project Structure

```
msc-website/
├── app/
│   ├── api/contact/route.ts   # Contact API (POST, GET)
│   ├── admin/page.tsx         # Admin dashboard (server component)
│   ├── layout.tsx             # Root layout with SEO metadata
│   ├── page.tsx               # Main one-page website
│   ├── globals.css            # Global styles & Tailwind config
│   ├── robots.ts              # SEO robots.txt
│   └── sitemap.ts             # SEO sitemap.xml
├── components/
│   ├── Navbar.tsx             # Fixed nav with mobile hamburger
│   ├── Hero.tsx               # Hero section
│   ├── Services.tsx           # Services grid with icons
│   ├── Solutions.tsx          # Business problems section
│   ├── Process.tsx            # 4-step process
│   ├── Technologies.tsx       # Tech stack pills
│   ├── About.tsx              # About section
│   ├── CTA.tsx                # Call-to-action
│   ├── Contact.tsx            # Contact form (honeypot, timing)
│   ├── Footer.tsx             # Footer
│   ├── ServiceIcon.tsx        # SVG icon renderer
│   ├── StructuredData.tsx     # JSON-LD structured data
│   ├── index.ts               # Barrel exports
│   └── ui/
│       ├── Button.tsx         # Reusable button
│       ├── Container.tsx      # Max-width container
│       └── index.ts           # Barrel exports
├── lib/
│   ├── constants.ts           # Site config & data
│   ├── db.ts                  # D1 database module
│   ├── validation.ts          # Zod schemas
│   └── rate-limit.ts          # Rate limiter
├── db/migrations/
│   └── 0001_initial.sql       # Contact submissions table
├── scripts/
│   └── db-setup.sh            # Local D1 setup
├── tests/
│   ├── api/contact.test.ts    # API + validation tests (31)
│   ├── components.test.tsx    # Component tests (42)
│   ├── security.test.ts       # Security tests (16)
│   ├── placeholder.test.ts    # Basic tests (2)
│   └── setup.ts               # Vitest setup
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── next.config.ts             # Security headers & config
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── vitest.config.ts           # Test config
└── wrangler.toml              # D1 local dev config
```

## Local Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

### Install

```bash
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your Cloudflare credentials
```

### Local Database

```bash
npm run db:setup
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:setup` | Setup local D1 database |
| `npm run db:migrate` | Run local migration |
| `npm run db:migrate:remote` | Run production migration |
| `npm run db:query` | Query local submissions |
| `npm run db:reset` | Reset local database |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Yes (production) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with D1 permissions | Yes (production) |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 database ID | Yes (production) |

**Local development**: No env vars needed — wrangler handles local D1 automatically.

## Cloudflare D1 Setup

1. Create D1 database: https://dash.cloudflare.com → Workers & Pages → D1
2. Run migration:
   ```bash
   npx wrangler d1 execute msc-website-db --remote --file=db/migrations/0001_initial.sql
   ```
3. Copy the database ID to your Vercel environment variables

## Deployment

### GitHub

Repository: https://github.com/Chuksbrownj/msc-website

### Vercel

1. Import the GitHub repository at https://vercel.com/new
2. Add environment variables (see above)
3. Deploy

### Custom Domain (Optional)

If using Cloudflare DNS:
1. Add domain to Cloudflare
2. In Vercel: Settings → Domains → Add your domain
3. In Cloudflare: Add CNAME record pointing to `cname.vercel-dns.com`
4. Set Cloudflare proxy to DNS-only (gray cloud) for initial setup

## Security

### Controls Implemented

- **Rate limiting**: 5 requests per IP per hour (in-memory sliding window)
- **Honeypot**: Hidden field catches bots, returns fake success
- **Timing check**: Rejects submissions faster than 3 seconds
- **Input validation**: Zod schemas with strict type checking
- **SQL injection**: Parameterized queries only (no string concatenation)
- **XSS**: React's default JSX escaping (no dangerouslySetInnerHTML in user content)
- **Security headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.
- **Error handling**: Safe error messages (no stack traces, SQL, or env vars exposed)
- **Admin protection**: /admin blocked from search engine crawlers
- **No secrets in client**: All API keys server-side only

### Headers Applied

| Header | Value |
|--------|-------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload |
| Content-Security-Policy | default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' |

## Testing

### Test Coverage

| Suite | Tests | Description |
|-------|-------|-------------|
| `tests/components.test.tsx` | 42 | Component rendering, accessibility, form behavior |
| `tests/api/contact.test.ts` | 31 | API routes, validation, error handling |
| `tests/security.test.ts` | 16 | Rate limiting, SQL injection, XSS, honeypot |
| `tests/placeholder.test.ts` | 2 | Basic project verification |
| **Total** | **91** | |

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
```

## Known Limitations

1. **Rate limiting**: In-memory state resets on serverless cold starts. Not shared across Vercel function instances. For production-grade rate limiting, use Cloudflare or Upstash Redis.
2. **Admin dashboard**: No authentication — anyone with the URL can view submissions. Add authentication before sharing the URL.
3. **No email notifications**: Submissions are stored in D1 but no email is sent to the team. Consider adding Resend or SendGrid.
4. **No analytics**: No tracking or analytics. Consider adding Vercel Analytics or Plausible.
5. **No OG image**: Social media shares show no preview image. Create a static OG image for better sharing.
6. **Single language**: English only. No i18n support.

## Recommended Future Improvements

- Add authentication to /admin (e.g., NextAuth, Supabase Auth)
- Add email notifications on new submissions (Resend, SendGrid)
- Add analytics (Vercel Analytics, Plausible)
- Create OG image for social media sharing
- Add rate limiting via Cloudflare or Upstash Redis for production
- Add blog or case studies section
- Add i18n support for multiple languages

## License

Proprietary — MSC.
