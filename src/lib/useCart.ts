"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CART_EVENT,
  getCart,
  saveCart,
  updateQuantity,
  removeFromCart,
  type CartItem,
} from "./cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
    const sync = () => setItems(getCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems(updateQuantity(id, quantity));
  }, []);

  const remove = useCallback((id: string) => {
    setItems(removeFromCart(id));
  }, []);

  return { items, mounted, setQuantity, remove };
}
