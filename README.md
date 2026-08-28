# MSC Website

A one-page corporate website for MSC — a software engineering company focused on AI automation, custom software, and full-stack development.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint (Next.js config) + Prettier
- **Hosting:** Vercel
- **Database:** Cloudflare D1 (reserved for future phases)

## Architecture

```
Browser
  │
  │  HTTPS
  ▼
Vercel
  │
  │  Next.js
  ├── Static/server-rendered one-page frontend
  └── Server-side API
         │
         ▼
    Cloudflare D1
```

The browser never accesses D1 directly. All database queries go through Next.js server-side API routes.

## Project Structure

```
msc-website/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main one-page website
│   ├── globals.css         # Global styles & Tailwind config
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap.xml
├── components/
│   └── ui/
│       ├── Container.tsx   # Max-width responsive container
│       ├── Section.tsx     # Standard page section wrapper
│       ├── Button.tsx      # Reusable button with variants
│       └── index.ts        # Barrel exports
├── lib/
│   └── constants.ts        # Site config & shared constants
├── db/
│   └── migrations/         # Cloudflare D1 migrations (future)
├── tests/
│   ├── setup.ts            # Vitest test setup
│   └── placeholder.test.ts # Placeholder tests
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier config
├── next.config.ts          # Next.js config
├── postcss.config.mjs      # PostCSS config (Tailwind)
├── tsconfig.json           # TypeScript config
├── vitest.config.ts        # Vitest config
└── package.json
```

## Local Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start dev server with Turbopack      |
| `npm run build`    | Production build                     |
| `npm run start`    | Start production server              |
| `npm run lint`     | Run ESLint                           |
| `npm run format`   | Format code with Prettier            |
| `npm run typecheck`| Run TypeScript type checking         |
| `npm run test`     | Run tests once                       |
| `npm run test:watch` | Run tests in watch mode            |

## Phase Status

- [x] Phase 1: Project Foundation & Architecture
- [ ] Phase 2: Database & Server-Side Logic
- [ ] Phase 3: Advanced Features
- [ ] Phase 4: Polish & Launch

## License

Proprietary — MSC.
