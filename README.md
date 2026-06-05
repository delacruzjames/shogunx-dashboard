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

1. Import [delacruzjames/shogunx-dashboard](https://github.com/delacruzjames/shogunx-dashboard) on [Vercel](https://vercel.com/new), or from this directory:

   ```bash
   npx vercel link --yes
   npx vercel env add API_URL production   # https://shogunx-api-7cf0de1a1fc6.herokuapp.com
   npx vercel deploy --prod
   ```

2. Set **Environment Variable** (required at **build time** for `/api` rewrites):

   | Variable | Value |
   |----------|-------|
   | `API_URL` | Your Rails API origin, e.g. `https://shogunx-api-7cf0de1a1fc6.herokuapp.com` |

   Leave `NEXT_PUBLIC_API_URL` unset so the browser uses same-origin `/api/*` proxy (no CORS needed on Rails).

3. **Production URL:** https://shogunx-dashboard.vercel.app

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
