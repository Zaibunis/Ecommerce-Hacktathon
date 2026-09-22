import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getOwnerKey } from "@/lib/owner";

type CartItemPayload = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
};

/** Save or update the signed-in user's profile */
export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const ownerKey = await getOwnerKey();
    if (!ownerKey.startsWith("user:")) {
      return NextResponse.json(
        { error: "Sign in to save your details" },
        { status: 401 }
      );
    }
    const clerkId = ownerKey.slice(5);

    const body = (await request.json()) as {
      email?: string;
      name?: string;
      shippingAddress?: string;
    };

    await sql`
      INSERT INTO users (clerk_id, email, name, shipping_address, updated_at)
      VALUES (${clerkId}, ${body.email ?? null}, ${body.name ?? null}, ${body.shippingAddress ?? null}, now())
      ON CONFLICT (clerk_id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, users.email),
        name = COALESCE(EXCLUDED.name, users.name),
        shipping_address = COALESCE(EXCLUDED.shipping_address, users.shipping_address),
        updated_at = now()
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("profile POST failed", e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

/** Get the signed-in user's profile */
export async function GET() {
  try {
    await ensureSchema();

    const ownerKey = await getOwnerKey();
    if (!ownerKey.startsWith("user:")) {
      return NextResponse.json({ profile: null });
    }
    const clerkId = ownerKey.slice(5);

    const rows = await sql`
      SELECT clerk_id, email, name, shipping_address
      FROM users WHERE clerk_id = ${clerkId}
    `;
    const row = rows[0];
    return NextResponse.json({
      profile: row
        ? {
            email: row.email,
            name: row.name,
            shippingAddress: row.shipping_address,
          }
        : null,
    });
  } catch (e) {
    console.error("profile GET failed", e);
    return NextResponse.json({ profile: null }, { status: 200 });
  }
}

/** Record a completed order (called after payment success) */
export async function PUT(request: NextRequest) {
  try {
    await ensureSchema();

    const ownerKey = await getOwnerKey();
    const body = (await request.json()) as {
      items?: CartItemPayload[];
      total?: number;
    };
    const items = Array.isArray(body.items) ? body.items : [];

    await sql`
      INSERT INTO orders (owner_key, total, status, items)
      VALUES (${ownerKey}, ${Number(body.total) || 0}, 'paid', ${JSON.stringify(items)}::jsonb)
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("order PUT failed", e);
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }
}
