export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
};

export const WISHLIST_KEY = "wishlist";
export const WISHLIST_EVENT = "shopco:wishlist-updated";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function isWishlisted(id: string): boolean {
  return getWishlist().some((i) => i.id === id);
}

export function toggleWishlist(item: WishlistItem): { items: WishlistItem[]; added: boolean } {
  const list = getWishlist();
  const existing = list.findIndex((i) => i.id === item.id);
  let added: boolean;
  if (existing >= 0) {
    list.splice(existing, 1);
    added = false;
  } else {
    list.push(item);
    added = true;
  }
  saveWishlist(list);
  return { items: list, added };
}

export function removeFromWishlist(id: string): WishlistItem[] {
  const list = getWishlist().filter((i) => i.id !== id);
  saveWishlist(list);
  return list;
}

export function clearWishlist() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WISHLIST_KEY);
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}
