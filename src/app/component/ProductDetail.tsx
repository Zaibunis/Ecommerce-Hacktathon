"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import { addToCart } from "@/lib/cart";

export type ProductData = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  discountPercent?: number;
  colors?: string[];
  sizes?: string[];
};

export default function ProductDetail({
  product,
  breadcrumb,
  backHref,
}: {
  product: ProductData;
  breadcrumb: string;
  backHref: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
        color: product.colors?.[0],
        size: product.sizes?.[0],
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

      <div className="max-w-[1280px] min-h-[60vh] p-3 m-auto">
        <div className="w-full flex md:flex-row flex-col md:py-12 gap-8">
          {/* Image */}
          <div className="md:w-3/5 w-full">
            <div className="p-6 bg-[#F9F1E7] h-full flex items-center justify-center rounded-2xl">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full max-h-[520px] object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/5 w-full pt-2">
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm text-gray-500">(150 reviews)</span>
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
                <span className="text-sm font-medium text-gray-600 block mb-2">Select Colors</span>
                <div className="flex gap-3">
                  {product.colors.map((color: string, i: number) => (
                    <span
                      key={i}
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
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
                    <span
                      key={size}
                      className="rounded-full text-sm px-6 h-[44px] flex items-center justify-center bg-gray-100 text-gray-600"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center justify-between bg-[#F0F0F0] px-4 py-2 rounded-full w-[150px] h-[52px]">
                <button className="text-lg font-semibold text-black" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  −
                </button>
                <span className="text-sm text-center text-black font-medium">{quantity}</span>
                <button className="text-lg font-semibold text-black" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>

              <button
                className="btn-primary px-8 h-[52px] w-full sm:w-[300px] text-sm font-medium"
                onClick={handleAddToCart}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            {added && (
              <Link
                href="/comp/cart"
                className="inline-block mt-4 text-sm font-semibold underline hover:no-underline"
              >
                View Cart →
              </Link>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
