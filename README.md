# ShogunX Dashboard

Read-only Next.js frontend for monitoring the ShogunX trading system.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Axios API client

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) if port 3000 is used by the Rails API (Next.js will pick the next free port, or set `PORT=3001`).

## Environment

| Variable | Description |
|----------|-------------|
| `API_URL` | Rails origin for Next.js `/api` rewrites (default `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Optional direct browser URL; leave unset to proxy via Next (avoids CORS) |

## Deploy to Vercel

**Production URL:** https://shogunx-dashboard.vercel.app

### GitHub Actions (`.github/workflows/deploy-vercel.yml`)

Production deploy runs when you **publish a GitHub Release**, or manually from the Actions tab.

Add one **Actions secret** under **Settings → Secrets and variables → Actions**:

| Secret | How to get it |
|--------|----------------|
| `VERCEL_TOKEN` | [Vercel Account → Tokens](https://vercel.com/account/settings/tokens) → Create → copy |

If you use a **production** environment with protection rules, add `VERCEL_TOKEN` there too.

Org and project IDs are already set in the workflow file (`team_2rfez24…`, `prj_4ZtgeDU…`).

Also set **`API_URL`** in the [Vercel project settings](https://vercel.com) (Production environment) — required at **build time** for `/api` rewrites:

```
https://shogunx-api-7cf0de1a1fc6.herokuapp.com
```

### Manual deploy (optional)

```bash
npx vercel link
printf 'https://shogunx-api-7cf0de1a1fc6.herokuapp.com' | npx vercel env add API_URL production
npx vercel deploy --prod
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview |
| `/market-snapshots` | Market snapshot table |
| `/trade-signals` | Trade signals table |
| `/orders` | Orders table |
| `/positions` | Positions table |
| `/performance` | Performance stats and P/L tables |

## API endpoints

The client calls these read endpoints under `/api/v1`:

- `GET /dashboard` — overview stats
- `GET /market_snapshots` — snapshot table
- `GET /trade_signals` — signals table
- `GET /orders` — orders table
- `GET /positions` — positions table
- `GET /performance` — performance stats and P/L series
- `GET /statistics` — same shape as performance (legacy)
- `GET /execution` — MT4 execution instruction (not used by dashboard UI)

## View-only

This app does not expose trade execution controls. No buy/sell or order placement UI is included.
