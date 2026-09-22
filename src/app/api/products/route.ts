import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Server-only client: no token needed — product data is public via the API CDN
const client = createClient({
  projectId: "017bgzcc",
  dataset: "production",
  apiVersion: "2025-01-07",
  useCdn: true, // cached, fast, and public
});

export const revalidate = 300; // cache the catalog for 5 minutes

let productsCache: { at: number; data: unknown[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;

export async function GET() {
  // In-process cache: repeat visits don't re-hit Sanity at all
  if (productsCache && Date.now() - productsCache.at < CACHE_MS) {
    return NextResponse.json(productsCache.data);
  }

  try {
    const products = await client.fetch(`
      *[_type == "products"] | order(_createdAt asc) {
        _id,
        name,
        description,
        price,
        "imageUrl": image.asset->url,
        category,
        discountPercent,
        "isNew": new,
        colors,
        sizes
      }
    `);

    const data = products ?? [];
    productsCache = { at: Date.now(), data };
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/products] Sanity fetch failed:", error);
    // Serve stale data rather than failing the whole storefront
    if (productsCache) return NextResponse.json(productsCache.data);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
