"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar, FaHeart, FaExchangeAlt } from "react-icons/fa";
import { addToCart } from "@/lib/cart";

export type CardProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  discountPercent?: number;
};

export default function ProductCard({
  product,
  detailHref,
}: {
  product: CardProduct;
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
        className="block relative h-[300px] w-full overflow-hidden rounded-xl bg-gray-100"
      >
        <Image
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          src={product.imageUrl}
          width={285}
          height={301}
        />

        {/* Hover overlay: click anywhere on it (except buttons) opens the detail page */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-5 text-center">
          <h3 className="text-white font-bold text-lg">{product.name}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{product.description}</p>
          <span className="text-white font-semibold">View Details →</span>
          <button
            onClick={handleAdd}
            className="btn-primary px-6 h-[40px] text-sm font-medium mt-1"
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </Link>

      <div className="pt-3">
        <h3 className="font-bold text-base leading-snug">{product.name}</h3>
        <p className="text-black/50 text-xs mb-1">{product.category}</p>
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="h-3.5 w-3.5 text-yellow-500" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold">${product.price}</p>
          {originalPrice && (
            <p className="text-black/40 line-through text-sm">${originalPrice}</p>
          )}
          {product.discountPercent && (
            <span className="text-[10px] font-bold text-white bg-[#FF3333] rounded-full px-2 py-0.5">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
