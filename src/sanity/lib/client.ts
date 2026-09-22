import { createClient } from "next-sanity";

/**
 * Public Sanity client.
 *
 * IMPORTANT: Do NOT put a token here — this module is imported by client
 * components, so anything in it ends up in the browser bundle.
 *
 * The project dataset is public (readable via the API CDN without a token),
 * so no token is required to read products.
 */
export const client = createClient({
  projectId: "017bgzcc",
  dataset: "production",
  apiVersion: "2025-01-07",
  useCdn: true,
});
