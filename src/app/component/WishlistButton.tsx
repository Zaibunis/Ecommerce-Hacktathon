"use client";

import { useState } from "react";
import { useWishlist } from "@/lib/useWishlist";
import type { Product } from "@/lib/types";

export default function WishlistButton({
  product,
  variant = "overlay",
}: {
  product: Product;
  variant?: "overlay" | "plain";
}) {
  const { mounted, toggle, has } = useWishlist();
  const [animate, setAnimate] = useState(false);
  const active = mounted && has(product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.category,
    });
    setAnimate(true);
    setTimeout(() => setAnimate(false), 350);
  };

  if (variant === "plain") {
    return (
      <button
        onClick={handleClick}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={active}
        className={`btn-outline h-[52px] w-[52px] p-0 !rounded-full shrink-0 transition-transform ${
          animate ? "scale-90" : ""
        }`}
      >
        <HeartIcon active={active} className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
        animate ? "scale-125" : ""
      }`}
    >
      <HeartIcon active={active} className="w-[18px] h-[18px]" />
    </button>
  );
}

function HeartIcon({ active, className }: { active: boolean; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={active ? "#FF3333" : "none"}
      stroke={active ? "#FF3333" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
