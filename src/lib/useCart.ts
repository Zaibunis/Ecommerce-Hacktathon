"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CART_EVENT,
  getCart,
  saveCart,
  type CartItem,
} from "./cart";

/**
 * Cart state backed by the server (Postgres).
 * - Reads come from /api/cart (cookie identifies guest or signed-in user).
 * - Writes go through /api/cart and update local state from the response.
 * - localStorage is kept in sync as a best-effort fallback.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      const serverItems: CartItem[] = Array.isArray(data.items) ? data.items : [];
      setItems(serverItems);
      saveCart(serverItems); // keep localStorage fallback in sync
    } catch {
      setItems(getCart());
    }
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
    const sync = () => refresh();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [refresh]);

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      setItems((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        );
        saveCart(next);
        fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: next }),
        }).catch(() => {});
        return next;
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveCart(next);
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: next }),
      }).catch(() => {});
      return next;
    });
  }, []);

  return { items, mounted, setQuantity, remove, refresh };
}
