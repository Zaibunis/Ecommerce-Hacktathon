import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Admin login: validates username + password against env vars server-side.
 * On success sets an httpOnly cookie whose VALUE is the admin secret —
 * the middleware compares it against ADMIN_SECRET_KEY to gate /admin/*.
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_SECRET_KEY;

    if (!validPass || username !== validUser || password !== validPass) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("shopco_admin", validPass, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

/** Session check: is the visitor an admin? */
export async function GET(request: NextRequest) {
  const isAdmin =
    Boolean(process.env.ADMIN_SECRET_KEY) &&
    request.cookies.get("shopco_admin")?.value === process.env.ADMIN_SECRET_KEY;
  return NextResponse.json({ ok: isAdmin });
}

/** Logout */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("shopco_admin", "", { path: "/", maxAge: 0 });
  return response;
}
