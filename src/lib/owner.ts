import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const GUEST_COOKIE = "shopco_guest_id";

/**
 * Storage owner key:
 * - signed-in users -> "user:<clerkUserId>" (permanent, follows the account)
 * - guests -> "guest:<uuid>" persisted in a 1-year cookie
 */
export async function getOwnerKey(): Promise<string> {
  try {
    const { userId } = auth();
    if (userId) return `user:${userId}`;
  } catch {
    // auth() unavailable in some route contexts — fall through to guest
  }

  const cookieStore = cookies();
  const existing = cookieStore.get(GUEST_COOKIE)?.value;
  if (existing) return `guest:${existing}`;

  const id = randomUUID();
  try {
    cookieStore.set(GUEST_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch {
    // cookies can only be set in Server Actions / Route Handlers
  }
  return `guest:${id}`;
}
