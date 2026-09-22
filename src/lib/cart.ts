export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
};

export const CART_KEY = "cart";
export const CART_EVENT = "shopco:cart-updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(
  item: { id: string; name: string; price: number; image?: string; size?: string; color?: string },
  quantity = 1
): CartItem[] {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  // Persist to the database (guest cookie or signed-in user)
  fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...item, quantity }),
  }).catch(() => {});
  return cart;
}

export function updateQuantity(id: string, quantity: number): CartItem[] {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity = Math.max(1, quantity);
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: string): CartItem[] {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem("promoApplied");
  window.dispatchEvent(new Event(CART_EVENT));
}

export function cartCount(items: CartItem[] = getCart()): number {
  return items.reduce((n, i) => n + (i.quantity || 0), 0);
}

export function cartSubtotal(items: CartItem[] = getCart()): number {
  return items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);
}

export const DELIVERY_FEE = 15;

/** Totals including promo (20% off when applied) and delivery */
export function getTotals(items: CartItem[] = getCart()) {
  const subtotal = cartSubtotal(items);
  const promoApplied =
    typeof window !== "undefined" && localStorage.getItem("promoApplied") === "true";
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal - discount + delivery;
  return { subtotal, discount, promoApplied, delivery, total };
}
