# Eastsider.org

Worcester, MA local guide — restaurants, places to go, and editorial articles.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth (admin CMS)
- Google Places API (optional; mock Worcester data included)

## Quick start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install and seed

```bash
npm install
npm run db:push
npm run db:seed
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default credentials (change in `.env`):

- Email: `admin@eastsider.org`
- Password: `changeme`

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_PLACES_API_KEY` | Optional — sync real places from Google |
| `AUTH_SECRET` | NextAuth secret |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (for SEO/sitemap) |

## Deploy to Vercel

1. Push to GitHub and import in [Vercel](https://vercel.com)
2. Add a Postgres database (Vercel Postgres, Supabase, or Neon)
3. Set environment variables in Vercel project settings
4. Add custom domain `eastsider.org`:
   - In Vercel: Project → Settings → Domains → Add `eastsider.org`
   - At your registrar: add the DNS records Vercel provides (usually `A`/`CNAME`)
5. Deploy — `postinstall` runs `prisma generate`; run `prisma db push` and seed against production DB once

## Features

- **Public site:** Home, article listing/detail, place pages, city-scoped search
- **Admin CMS:** Draft/publish articles, link places, sync venue data
- **Search:** PostgreSQL full-text search across articles and places in Worcester
- **SEO:** Sitemap, robots.txt, Open Graph metadata

## Google Places sync

With `GOOGLE_PLACES_API_KEY` set, use **Admin → Sync from Google** to import real Worcester venues. Without a key, **Seed mock Worcester data** loads 20 real local place names with addresses.
