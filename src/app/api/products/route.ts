import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Server-only client: no token needed — product data is public via the API CDN
const client = createClient({
  projectId: "017bgzcc",
  dataset: "production",
  apiVersion: "2025-01-07",
  useCdn: true, // cached, fast, and public
});

export const dynamic = "force-dynamic";

export async function GET() {
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

    return NextResponse.json(products ?? []);
  } catch (error) {
    console.error("[api/products] Sanity fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
