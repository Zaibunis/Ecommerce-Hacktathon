import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getOwnerKey } from "@/lib/owner";

type IncomingItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
};

const norm = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export async function GET() {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const rows = await sql`
      SELECT product_id AS id, name, price, image, category
      FROM wishlist_items WHERE owner_key = ${ownerKey}
      ORDER BY created_at ASC
    `;
    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error("wishlist GET failed", e);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

/** Toggle an item in the wishlist; returns the new state */
export async function POST(request: NextRequest) {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const item = (await request.json()) as IncomingItem;
    if (!item?.id || !item?.name) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    const existing = await sql`
      SELECT id FROM wishlist_items
      WHERE owner_key = ${ownerKey} AND product_id = ${item.id}
    `;

    if (existing.length > 0) {
      await sql`
        DELETE FROM wishlist_items
        WHERE owner_key = ${ownerKey} AND product_id = ${item.id}
      `;
      return NextResponse.json({ added: false });
    }

    await sql`
      INSERT INTO wishlist_items (owner_key, product_id, name, price, image, category)
      VALUES (${ownerKey}, ${item.id}, ${item.name}, ${Number(item.price) || 0}, ${norm(item.image)}, ${norm(item.category)})
      ON CONFLICT (owner_key, product_id) DO NOTHING
    `;
    return NextResponse.json({ added: true });
  } catch (e) {
    console.error("wishlist POST failed", e);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

/** Remove one item */
export async function DELETE(request: NextRequest) {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    await sql`
      DELETE FROM wishlist_items
      WHERE owner_key = ${ownerKey} AND product_id = ${productId}
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("wishlist DELETE failed", e);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
