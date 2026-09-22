import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Admin data endpoint.
 * Auth: the client must send the shared admin key in the `x-admin-key` header,
 * matched against the ADMIN_SECRET_KEY env var (server-side only — never shipped
 * to the browser like the old hardcoded credentials were).
 */
function isAuthorized(request: NextRequest): boolean {
  return (
    Boolean(process.env.ADMIN_SECRET_KEY) &&
    request.cookies.get("shopco_admin")?.value === process.env.ADMIN_SECRET_KEY
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();

    const orders = await sql`
      SELECT id, owner_key, total, status, items, created_at
      FROM orders ORDER BY created_at DESC LIMIT 200
    `;

    const users = await sql`SELECT COUNT(*)::int AS count FROM users`;

    const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);

    // Revenue by day for the chart (last 14 days that have orders)
    const byDay = new Map<string, number>();
    for (const o of orders) {
      const day = new Date(o.created_at).toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) || 0) + Number(o.total || 0));
    }
    const revenueByDay = Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, total]) => ({ date, total }));

    return NextResponse.json({
      stats: {
        orders: orders.length,
        revenue,
        users: users[0]?.count ?? 0,
      },
      revenueByDay,
      orders: orders.map((o) => ({
        id: o.id,
        owner: o.owner_key,
        total: Number(o.total),
        status: o.status,
        items: o.items,
        createdAt: o.created_at,
      })),
    });
  } catch (e) {
    console.error("admin orders failed", e);
    return NextResponse.json({ error: "Failed to load admin data" }, { status: 500 });
  }
}
