import { client } from "./client";

export async function sanityFetch({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}) {
  return client.fetch(query, params);
}
