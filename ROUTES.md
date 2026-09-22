# SHOP.CO — Routes Reference

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage: hero, brands marquee, New Arrivals + Top Selling sections, dress styles, reviews, chatbot, newsletter |
| `/shop/casual` | `src/app/shop/casual/page.tsx` | Casual listing with professional filter panel (price/color/size) + sort |
| `/shop/mens-clothes` | `src/app/shop/mens-clothes/page.tsx` | Shirts/jeans/shorts listing + sort |
| `/product/[id]` | `src/app/product/[id]/page.tsx` | Unified product detail: gallery, color/size pickers, quantity, wishlist, tabs, related products |
| `/cart` | `src/app/cart/page.tsx` | Cart page with promo code and order summary |
| `/wishlist` | `src/app/wishlist/page.tsx` | Saved products, move-all-to-cart |
| `/checkout` | `src/app/checkout/page.tsx` | Billing details (prefilled from profile) + Stripe payment |
| `/payment-success` | `src/app/payment-success/page.tsx` | Records the order, clears cart |
| `/search?q=` | `src/app/search/page.tsx` | Product search across name/description/category |
| `/sign-in` | `src/app/sign-in/page.tsx` | Clerk sign-in/sign-up page |
| `/studio/[[...tool]]` | `src/app/studio/` | Embedded Sanity Studio (CMS admin) |

> Home grid sections (New Arrivals / Top Selling) are components (`src/components/shop/ProductSection.tsx`), not routes.

## API Routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/products` | GET | All products from Sanity (server-side; cached CDN) |
| `/api/cart` | GET / POST / PUT / DELETE | Read cart, add item, replace cart, clear cart — persisted in Neon Postgres per owner |
| `/api/wishlist` | GET / POST / DELETE | Read wishlist, toggle item, remove item — persisted per owner |
| `/api/profile` | GET / POST / PUT | Get profile, save profile, record completed order |
| `/api/chat` | GET `?q=` | Shopping-assistant answers from the live catalog |
| `/api/payment-intent` | POST | Creates a Stripe PaymentIntent from the real cart total |

## Auth & Middleware

`src/middleware.ts` protects `/shop/*`, `/cart`, `/wishlist`, `/checkout` and `/product/*` — unauthenticated visitors are redirected to Clerk sign-in.

## Shared Components (`src/app/component/`)

| Component | Role |
|---|---|
| `Header.tsx` | Sticky nav: announcement bar, Shop dropdown, search, wishlist + cart badges, Clerk auth, mobile menu |
| `Footer.tsx` | Link columns, socials, payment badges |
| `Newsletter.tsx` | Email signup with validation states |
| `hero.tsx` | Animated hero with CSS sparkles |
| `brand.tsx` | Infinite logo marquee |
| `dressStyle.tsx` | Clickable style cards (labels baked into images) |
| `review.tsx` | Reviews carousel with working arrows (embla) |
| `ProductCard.tsx` | Card with badges, wishlist heart, hover quick-add |
| `ProductCardSkeleton.tsx` | Loading skeletons |
| `ProductDetail.tsx` | Shared detail layout used by other surfaces |
| `WishlistButton.tsx` | Heart toggle (overlay + plain variants) |
| `SortSelect.tsx` | Styled sort dropdown |
| `Chatbot.tsx` | On-theme shopping assistant (catalog-aware) |
| `WelcomePromo.tsx` | Signed-in "You got 20% off" popup (once) |
| `CheckoutPage.tsx` / `StripePayment/page.tsx` | Stripe Elements wiring to cart total |
| `DynamicClerkComponents.tsx` | Client-safe Clerk buttons |

## Libraries (`src/lib/`)

| Module | Role |
|---|---|
| `db.ts` | Neon `sql` client + `ensureSchema()` (server-only) |
| `owner.ts` | Owner key: `user:<clerkId>` or `guest:<cookie-uuid>` (server-only) |
| `cart.ts` | Cart item shape, localStorage fallback, totals + promo math |
| `useCart.ts` | Cart state via `/api/cart` |
| `wishlist.ts` / `useWishlist.ts` | Wishlist storage + state via `/api/wishlist` |
| `useProducts.ts` | Product loading via `/api/products` (session-cached) |
| `types.ts` | Shared `Product` type |
| `ConvertToSubCurrency.tsx` | Dollars → cents for Stripe |
