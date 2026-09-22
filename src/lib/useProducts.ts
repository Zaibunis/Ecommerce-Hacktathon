"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";

let cache: Product[] | null = null;

/**
 * Fetches all products once via the server-side API route (no CORS issues
 * on deployment) and caches them for the session so navigation between
 * listing pages is instant.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load products"))))
      .then((data) => {
        if (cancelled) return;
        cache = data;
        setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}

export function findProduct(products: Product[], id: string) {
  return products.find((p) => p._id === id) ?? null;
}
