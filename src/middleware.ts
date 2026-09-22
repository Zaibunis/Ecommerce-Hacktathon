import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Storefront routes that require Clerk authentication
const isProtectedRoute = createRouteMatcher([
  '/shop/mens-clothes(.*)',
  '/shop/casual(.*)',
  '/cart(.*)',
  '/wishlist(.*)',
  '/checkout(.*)',
  '/product(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, redirectToSignIn } = await auth();

  // ── Admin gate ────────────────────────────────────────────────
  // /admin/* is invisible to everyone except the admin.
  // /admin/login is the only public admin page (it issues the cookie).
  // The cookie value must equal ADMIN_SECRET_KEY (httpOnly, so browser
  // JavaScript can't read or forge it).
  const path = req.nextUrl.pathname;
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    const provided = req.cookies.get('shopco_admin')?.value;
    if (!adminSecret || provided !== adminSecret) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = ''; // strip any query params
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── Storefront auth gate ──────────────────────────────────────
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
