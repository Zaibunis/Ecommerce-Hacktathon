"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import { addToCart } from "@/lib/cart";
import WishlistButton from "./WishlistButton";
import type { Product } from "@/lib/types";

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  green: "#22C55E",
  blue: "#3B82F6",
  darkblue: "#1E3A8A",
  yellow: "#EAB308",
  purple: "#A855F7",
  pink: "#EC4899",
  orange: "#F97316",
  brown: "#78350F",
  grey: "#9CA3AF",
};

export default function ProductDetail({
  product,
  breadcrumb,
  backHref,
}: {
  product: Product;
  breadcrumb: string;
  backHref: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");

  const originalPrice = product.discountPercent
    ? (product.price / (1 - product.discountPercent / 100)).toFixed(2)
    : null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href={backHref} className="hover:underline">{breadcrumb}</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container-shop min-h-[60vh] py-6 md:py-10">
        <div className="w-full flex md:flex-row flex-col md:py-6 gap-8">
          {/* Image */}
          <div className="md:w-3/5 w-full">
            <div className="p-6 bg-[#F9F1E7] h-full flex items-center justify-center rounded-2xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full max-h-[520px] object-cover rounded-xl"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/5 w-full pt-2">
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm text-gray-500">4.8/5 · (150 reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-black">${product.price}</span>
              {originalPrice && (
                <>
                  <span className="text-xl line-through text-gray-400">${originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600 block mb-2">
                  Select Color: <span className="capitalize font-bold text-black">{selectedColor}</span>
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                      title={color}
                      className={`w-9 h-9 rounded-full border transition-transform ${
                        selectedColor === color
                          ? "ring-2 ring-black ring-offset-2 scale-110"
                          : "border-black/10 hover:scale-105"
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color.toLowerCase()] || color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-600 block mb-2">Choose Size</span>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full text-sm px-6 h-[44px] flex items-center justify-center transition-colors ${
                        selectedSize === size
                          ? "bg-black text-white font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center justify-between bg-[#F0F0F0] px-4 py-2 rounded-full w-[140px] h-[52px] shrink-0">
                <button
                  className="text-lg font-semibold text-black w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm text-center text-black font-medium">{quantity}</span>
                <button
                  className="text-lg font-semibold text-black w-8"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="btn-primary px-8 h-[52px] flex-1 sm:flex-none text-sm font-medium"
                onClick={handleAddToCart}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>

              <WishlistButton product={product} variant="plain" />
            </div>

            {added && (
              <Link
                href="/comp/cart"
                className="inline-block mt-4 text-sm font-semibold underline hover:no-underline"
              >
                View Cart →
              </Link>
            )}

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-black/10 text-center">
              <div>
                <p className="font-bold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $100</p>
              </div>
              <div>
                <p className="font-bold text-sm">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
              <div>
                <p className="font-bold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-500">Stripe protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
