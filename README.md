# SHOP.CO — Full-Stack E-Commerce Store

A production-style fashion e-commerce application built with **Next.js (App Router)**, featuring a Sanity CMS catalog, Clerk authentication, Stripe payments, a Neon Postgres persistence layer, and an on-theme shopping-assistant chatbot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS + shadcn/ui components |
| Product catalog | Sanity CMS (public dataset, fetched server-side) |
| Auth | Clerk (`@clerk/nextjs`) |
| Database | Neon serverless Postgres (`@neondatabase/serverless`) |
| Payments | Stripe Payment Element |
| Chatbot | Rule-based assistant over live catalog data |

## Architecture Overview

```
Browser (React client components)
  │
  ├── /api/products   ──► Sanity CDN (server-side fetch, no CORS/token issues)
  ├── /api/cart       ──► Neon Postgres (guest cookie or Clerk user)
  ├── /api/wishlist   ──► Neon Postgres
  ├── /api/profile    ──► Neon Postgres (profile + order history)
  ├── /api/chat       ──► Sanity CDN (product-aware answers)
  └── /api/payment-intent ──► Stripe
```

Key design decisions:

- **All third-party data is fetched server-side.** Browser code never talks to Sanity or holds any secret. This fixed the CORS 403 failures on the deployed site and removed the leaked Sanity token from the client bundle.
- **Storage is keyed by "owner"**: signed-in users get `user:<clerkId>`, guests get `guest:<uuid>` stored in an httpOnly cookie. Carts survive browser restarts and sync across devices once the user signs in.
- **localStorage is only a fallback** — if the database is unreachable, the cart/wishlist still work in-session.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

### Environment Variables

All in `.env.local` (never committed):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (carts, wishlists, profiles, orders) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project (`017bgzcc`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (`production`) |
| `SANITY_API_TOKEN` | Optional; only needed for the embedded Sanity Studio |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk backend key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |

> ⚠️ The old `SANITY_API_TOKEN` was committed to git historically — rotate it in sanity.io/manage.

## Database Schema (Neon Postgres)

| Table | Purpose |
|---|---|
| `users` | Clerk user profiles: email, name, shipping address |
| `cart_items` | Per-owner cart rows, unique on `(owner, product, size, color)` |
| `wishlist_items` | Per-owner wishlist rows, unique on `(owner, product)` |
| `orders` | Completed orders with JSONB line items |

The schema is created lazily by `ensureSchema()` (`src/lib/db.ts`) — no migration step needed.

## Routing Map

See [ROUTES.md](./ROUTES.md) for the complete page + API route reference.

## Features

### Storefront
- Animated hero with CSS sparkles, brand marquee, dress-style cards, reviews carousel
- Semantic product grids: New Arrivals, Top Selling, Casual, Formal
- Product detail pages with selectable colors/sizes, quantity stepper, wishlist toggle
- Professional filter panel (price/color/size accordion) with mobile slide-over drawer
- Working sort (Most Popular / price low-high / price high-low)
- Client-side search across name/description/category

### Cart & Checkout
- Persistent cart (Postgres) with localStorage fallback
- Promo code `DISCOUNT20` (20% off), shown via the signed-in welcome popup
- Stripe Payment Element wired to the **real** cart total
- Orders recorded server-side on payment success; cart auto-clears

### Wishlist
- Heart toggle on every product card and detail page
- Dedicated wishlist page with "Move All to Cart"
- Persistent per-owner storage

### Account
- Clerk modal sign-in/sign-up
- Checkout form prefills from the saved profile; "Save my details" persists it
- Order history recorded per owner on payment success

### Chatbot
- On-theme black/white assistant, fully responsive
- Answers from the live Sanity catalog (prices, discounts, availability)
- Off-topic questions get a polite redirect back to store topics
- Starter suggestion chips, typing indicator, auto-scroll

## Conventions

- Fonts: `font-integral` (display), `font-satoshi` (body) — defined in `globals.css`
- Shared classes: `.container-shop`, `.btn-primary`, `.btn-outline` (also `globals.css`)
- Path alias: `@/` → `src/`
- Server-only modules: `src/lib/db.ts`, `src/lib/owner.ts` — never import from client components

## Deployment Notes

- Deploy on Vercel; add all env vars to the project settings.
- Add your production domain to Sanity Manage → API → CORS origins (for the embedded Studio only).
- Neon free tier is sufficient for this workload; the driver scales to zero between requests.
