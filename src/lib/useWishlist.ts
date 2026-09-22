"use client";

import { useCallback, useEffect, useState } from "react";
import { WISHLIST_EVENT, getWishlist, type WishlistItem } from "./wishlist";

/**
 * Wishlist state backed by the server (Postgres).
 * - Reads come from /api/wishlist.
 * - Toggle/remove go through the API and update local state from the response.
 * - localStorage is kept in sync as a best-effort fallback.
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      const data = await res.json();
      const serverItems: WishlistItem[] = Array.isArray(data.items) ? data.items : [];
      setItems(serverItems);
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(serverItems));
        window.dispatchEvent(new Event(WISHLIST_EVENT));
      }
    } catch {
      setItems(getWishlist());
    }
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
    const sync = () => refresh();
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [refresh]);

  const toggle = useCallback(
    async (item: WishlistItem) => {
      // Optimistic update
      setItems((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        const next = exists
          ? prev.filter((i) => i.id !== item.id)
          : [...prev, item];
        if (typeof window !== "undefined") {
          localStorage.setItem("wishlist", JSON.stringify(next));
        }
        return next;
      });

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        // Reconcile with server truth
        setItems((prev) => {
          const exists = prev.some((i) => i.id === item.id);
          if (data.added && !exists) return [...prev, item];
          if (!data.added && exists) return prev.filter((i) => i.id !== item.id);
          return prev;
        });
        return Boolean(data.added);
      } catch {
        return items.some((i) => i.id === item.id);
      }
    },
    [items]
  );

  const remove = useCallback(async (id: string) => {
    // Optimistic
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/wishlist?productId=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {}
  }, []);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, mounted, toggle, remove, has, refresh };
}
