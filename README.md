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
| Testing | Vitest |
| Linting | ESLint + Prettier |
| Hosting | Vercel |
| Database | Cloudflare D1 |
| DNS | Cloudflare (optional) |

## Features

- **10 sections**: Navbar, Hero, Services, Solutions, Process, Technologies, About, CTA, Contact, Footer
- **Responsive design**: 320px → 1440px, no horizontal scroll
- **Accessibility**: Semantic HTML, keyboard navigation, focus states, reduced-motion support
- **Contact API**: POST /api/contact with Zod validation, D1 storage
- **Admin dashboard**: /admin to view all submissions
- **Security**: Rate limiting (5/IP/hour), honeypot, timing checks, CSP, HSTS, XSS/SQL injection prevention
- **49 passing tests**

## Project Structure

```
msc-website/
├── app/
│   ├── api/contact/route.ts   # Contact API (POST, GET)
│   ├── admin/page.tsx         # Admin dashboard (server component)
│   ├── layout.tsx             # Root layout with metadata
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
│   ├── index.ts               # Barrel exports
│   └── ui/
│       ├── Button.tsx         # Reusable button
│       ├── Container.tsx      # Max-width container
│       ├── Section.tsx        # Section wrapper
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
│   ├── api/contact.test.ts    # API + validation tests
│   ├── security.test.ts       # Security tests
│   ├── placeholder.test.ts    # Placeholder tests
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

## Deployment

### GitHub

Repository: https://github.com/Chuksbrownj/msc-website

### Vercel

1. Import the GitHub repository at https://vercel.com/new
2. Add environment variables (see below)
3. Deploy

### Environment Variables (Vercel)

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with D1 permissions |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 database ID |

### Cloudflare D1

1. Create D1 database: https://dash.cloudflare.com → Workers & Pages → D1
2. Run migration: `npx wrangler d1 execute msc-website-db --remote --file=db/migrations/0001_initial.sql`

### Custom Domain (Optional)

If using Cloudflare DNS:
1. Add domain to Cloudflare
2. In Vercel: Settings → Domains → Add your domain
3. In Cloudflare: Add CNAME record pointing to `cname.vercel-dns.com`
4. Set Cloudflare proxy to DNS-only (gray cloud) for initial setup

## Phase Status

- [x] Phase 1: Project Foundation & Architecture
- [x] Phase 2: UI/UX & One-Page Frontend
- [x] Phase 3: Cloudflare D1 Database
- [x] Phase 4: Backend Contact API
- [x] Phase 5: Security & Abuse Protection
- [x] Phase 6: Connectivity & Deployment

## License

Proprietary — MSC.
