"use client";

import { useCallback, useEffect, useState } from "react";
import { WISHLIST_EVENT, getWishlist, type WishlistItem } from "./wishlist";

/**
 * Wishlist state backed by the server (Postgres).
 *
 * Performance notes (this hook previously caused an infinite fetch loop):
 * - refresh() writes localStorage silently, never dispatching the event that
 *   its own listener listens to.
 * - One shared store across all components — a page with 8 ProductCards makes
 *   ONE /api/wishlist request, not 8.
 */

let sharedItems: WishlistItem[] | null = null;
const listeners = new Set<(items: WishlistItem[]) => void>();

function emit(next: WishlistItem[]) {
  sharedItems = next;
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(next));
  }
  listeners.forEach((fn) => fn(next));
}

async function refreshShared() {
  try {
    const res = await fetch("/api/wishlist", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const serverItems: WishlistItem[] = Array.isArray(data.items) ? data.items : [];
    emit(serverItems);
  } catch {
    // keep local fallback
  }
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(sharedItems ?? []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = (next: WishlistItem[]) => setItems(next);
    listeners.add(update);
    setMounted(true);

    if (sharedItems === null) {
      sharedItems = [];
      refreshShared();
    }

    const onStorage = () => refreshShared();
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback(
    async (item: WishlistItem) => {
      // Optimistic update
      const wasAdded = !(sharedItems ?? []).some((i) => i.id === item.id);
      emit(
        wasAdded
          ? [...(sharedItems ?? []), item]
          : (sharedItems ?? []).filter((i) => i.id !== item.id)
      );

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        return Boolean(data.added);
      } catch {
        return wasAdded;
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    emit((sharedItems ?? []).filter((i) => i.id !== id));
    try {
      await fetch(`/api/wishlist?productId=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {}
  }, []);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, mounted, toggle, remove, has };
}
