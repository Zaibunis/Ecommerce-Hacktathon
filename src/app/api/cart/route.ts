import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getOwnerKey } from "@/lib/owner";

type IncomingItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
};

const norm = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export async function GET() {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const rows = await sql`
      SELECT product_id AS id, name, price, quantity, image, size, color
      FROM cart_items WHERE owner_key = ${ownerKey}
      ORDER BY created_at ASC
    `;
    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error("cart GET failed", e);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

/** Replace the whole cart for the current owner */
export async function PUT(request: NextRequest) {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const body = (await request.json()) as { items?: IncomingItem[] };
    const items = Array.isArray(body.items) ? body.items : [];

    await sql`DELETE FROM cart_items WHERE owner_key = ${ownerKey}`;
    for (const it of items) {
      if (!it?.id || !it?.name) continue;
      await sql`
        INSERT INTO cart_items (owner_key, product_id, name, price, quantity, image, size, color)
        VALUES (${ownerKey}, ${it.id}, ${it.name}, ${Number(it.price) || 0},
                ${Math.max(1, Number(it.quantity) || 1)}, ${norm(it.image)}, ${norm(it.size)}, ${norm(it.color)})
        ON CONFLICT (owner_key, product_id, size, color)
        DO UPDATE SET quantity = EXCLUDED.quantity, price = EXCLUDED.price, name = EXCLUDED.name, image = EXCLUDED.image
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("cart PUT failed", e);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

/** Add one item (merges duplicates by product+size+color) */
export async function POST(request: NextRequest) {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    const item = (await request.json()) as IncomingItem;
    if (!item?.id || !item?.name) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    await sql`
      INSERT INTO cart_items (owner_key, product_id, name, price, quantity, image, size, color)
      VALUES (${ownerKey}, ${item.id}, ${item.name}, ${Number(item.price) || 0},
              ${Math.max(1, Number(item.quantity) || 1)}, ${norm(item.image)}, ${norm(item.size)}, ${norm(item.color)})
      ON CONFLICT (owner_key, product_id, size, color)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("cart POST failed", e);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await ensureSchema();
    const ownerKey = await getOwnerKey();
    await sql`DELETE FROM cart_items WHERE owner_key = ${ownerKey}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("cart DELETE failed", e);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
