import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  discountPercent?: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    await ensureSchema();
    const res = await fetch("https://017bgzcc.apicdn.sanity.io/v2025-01-07/data/query/production", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `*[_type == "products"] {
          _id, name, description, price,
          "imageUrl": image.asset->url,
          category, discountPercent
        }`,
      }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    const products = (await res.json()) as Product[];
    const result = Array.isArray(products) ? products : [];

    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      const filtered = result.filter((p) => {
        const hay = `${p.name} ${p.description} ${p.category ?? ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      });
      return NextResponse.json({ answer: buildAnswer(q, filtered), products: filtered });
    }

    return NextResponse.json({
      answer:
        "I can help with our products! Ask me things like:\n• \"What t-shirts do you have?\"\n• \"Show me jeans under $150\"\n• \"How much is the Gradient Graphic T-shirt?\"\n• \"Any discounts today?\"",
      products: [],
    });
  } catch (e) {
    console.error("chat GET failed", e);
    return NextResponse.json(
      {
        answer:
          "Sorry — I'm having trouble reaching the store right now. Please try again in a moment.",
        products: [],
      },
      { status: 200 }
    );
  }
}

function buildAnswer(q: string, products: Product[]): string {
  if (products.length === 0) {
    return `I couldn't find anything for \"${q}\". We currently stock t-shirts, shirts, jeans and shorts — try one of those!`;
  }

  const nameMatch = products.find((p) => q.includes(p.name.toLowerCase()));
  if (nameMatch && products.length === 1) {
    const d = nameMatch.discountPercent
      ? ` It's ${nameMatch.discountPercent}% off right now!`
      : "";
    return `${nameMatch.name} — $${nameMatch.price}.${d} ${shortDesc(nameMatch.description)}\n\nType its name in the search bar to view details.`;
  }

  const list = products
    .slice(0, 5)
    .map((p) => `• ${p.name} — $${p.price}${p.discountPercent ? ` (-${p.discountPercent}%)` : ""}`)
    .join("\n");
  const more = products.length > 5 ? `\n…and ${products.length - 5} more.` : "";
  return `I found ${products.length} matching product(s):\n${list}${more}`;
}

function shortDesc(desc: string): string {
  if (!desc) return "";
  const first = desc.split(/[.!]/)[0];
  return first.length > 120 ? `${first.slice(0, 117)}...` : `${first}.`;
}
