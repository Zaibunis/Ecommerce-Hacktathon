"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addToCart } from "@/lib/cart";
import WishlistButton from "./WishlistButton";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  detailHref,
}: {
  product: Product;
  detailHref: string;
}) {
  const [added, setAdded] = useState(false);
  const originalPrice = product.discountPercent
    ? (product.price / (1 - product.discountPercent / 100)).toFixed(2)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group">
      <Link
        href={detailHref}
        className="block relative h-[280px] md:h-[310px] w-full overflow-hidden rounded-2xl bg-[#F0F0F0]"
      >
        <Image
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          src={product.imageUrl}
          width={285}
          height={301}
        />

        {/* Wishlist heart */}
        <WishlistButton product={product} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-white/95 backdrop-blur text-black text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {(product.discountPercent ?? 0) >= 30 && (
            <span className="bg-[#FF3333] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Hover quick-add */}
        <button
          onClick={handleAdd}
          className="absolute inset-x-3 bottom-3 h-[40px] rounded-full bg-black/85 backdrop-blur text-white text-sm font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black"
        >
          {added ? "✓ Added to Cart" : "+ Add to Cart"}
        </button>
      </Link>

      <div className="pt-3.5">
        <h3 className="font-bold text-base leading-snug truncate">{product.name}</h3>
        <p className="text-black/50 text-xs mb-1.5 capitalize">{product.category}</p>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="h-3 w-3 text-yellow-500" />
            ))}
          </span>
          <span className="text-xs text-black/40">4.8</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-lg">${product.price}</p>
          {originalPrice && (
            <p className="text-black/40 line-through text-sm">${originalPrice}</p>
          )}
        </div>
      </div>
    </div>
  );
}
