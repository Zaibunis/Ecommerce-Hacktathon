"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CART_EVENT,
  getCart,
  saveCartSilent,
  type CartItem,
} from "./cart";

/**
 * Cart state backed by the server (Postgres).
 *
 * Performance notes (this hook previously caused an infinite fetch loop):
 * - `saveCart` (which broadcasts CART_EVENT) is never called inside refresh,
 *   so the event listener can't re-trigger itself.
 * - Mutation paths (add/remove/quantity) update local state immediately and
 *   push to the server in the background.
 */

let sharedItems: CartItem[] | null = null;
const listeners = new Set<(items: CartItem[]) => void>();

function emit(next: CartItem[]) {
  sharedItems = next;
  saveCartSilent(next);
  listeners.forEach((fn) => fn(next));
}

export function broadcastCartChanged() {
  refreshShared();
}

async function refreshShared() {
  try {
    const res = await fetch("/api/cart", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const serverItems: CartItem[] = Array.isArray(data.items) ? data.items : [];
    emit(serverItems);
  } catch {
    // keep local fallback
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(sharedItems ?? []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = (next: CartItem[]) => setItems(next);
    listeners.add(update);
    setMounted(true);

    if (sharedItems === null) {
      sharedItems = [];
      refreshShared();
    }

    const onStorage = () => refreshShared();
    window.addEventListener("storage", onStorage);

    // Fired once per successful mutation (e.g. addToCart from any surface).
    // Safe: refreshShared never re-dispatches this event.
    const onCartEvent = () => refreshShared();
    window.addEventListener(CART_EVENT, onCartEvent);

    return () => {
      listeners.delete(update);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_EVENT, onCartEvent);
    };
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      );
      emit(next);
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: next }),
      }).catch(() => {});
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      emit(next);
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: next }),
      }).catch(() => {});
      return next;
    });
  }, []);

  return { items, mounted, setQuantity, remove };
}
