import { neon } from "@neondatabase/serverless";

/**
 * Serverless Postgres client (Neon).
 * Server-side only — never import this from a client component.
 */
export const sql = neon(process.env.DATABASE_URL!);

/** Ensure the schema exists. Cheap; called once per API request. */
export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      clerk_id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      shipping_address TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      owner_key TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      image TEXT,
      size TEXT,
      color TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (owner_key, product_id, size, color)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id SERIAL PRIMARY KEY,
      owner_key TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      image TEXT,
      category TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (owner_key, product_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      owner_key TEXT NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'paid',
      items JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
