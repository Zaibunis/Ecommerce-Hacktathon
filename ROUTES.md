# SHOP.CO — Routes Reference

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Homepage: hero, brands, New Arrivals + Top Selling grids, dress styles, reviews, chatbot, newsletter |
| `/search?q=` | `src/app/search/page.tsx` | Product search across name/description/category |
| `/comp/casual` | `src/app/comp/casual/page.tsx` | Casual listing with professional filter panel (price/color/size) + sort |
| `/comp/mens-clothes` | `src/app/comp/mens-clothes/page.tsx` | Shirts/jeans/shorts listing + sort |
| `/comp/cart` | `src/app/comp/cart/page.tsx` | Cart page with promo code and order summary |
| `/comp/wishlist` | `src/app/comp/wishlist/page.tsx` | Saved products, move-all-to-cart |
| `/component/checkout` | `src/app/component/checkout/page.tsx` | Billing details (prefilled from profile) + Stripe payment |
| `/payment-success` | `src/app/payment-success/page.tsx` | Records the order, clears cart |
| `/productOne/[id]` … `/productFour/[id]` | `src/app/product*/[id]/page.tsx` | Product detail pages (all share `ProductDetail`) |
| `/productOne` … `/productFour` | `src/app/product*/page.tsx` | Home grid sections (New Arrivals, Top Selling, Casual, Formal) |
| `/component/authentication` | `src/app/component/authentication/page.tsx` | Clerk sign-in/sign-up page |
| `/studio/[[...tool]]` | `src/app/studio/` | Embedded Sanity Studio (CMS admin) |

## API Routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/products` | GET | All products from Sanity (server-side; cached CDN) |
| `/api/cart` | GET / POST / PUT / DELETE | Read cart, add item, replace cart, clear cart — persisted in Neon Postgres per owner |
| `/api/wishlist` | GET / POST / DELETE | Read wishlist, toggle item, remove item — persisted per owner |
| `/api/profile` | GET / POST / PUT | Get profile, save profile, record completed order |
| `/api/chat` | GET `?q=` | Shopping-assistant answers from the live catalog |
| `/api/payment-intent` | POST | Creates a Stripe PaymentIntent from the real cart total |

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
| `ProductDetail.tsx` | Shared detail layout: color/size pickers, quantity, wishlist, trust row |
| `ProductPageShell.tsx` | Data shell for the four `[id]` detail routes |
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
