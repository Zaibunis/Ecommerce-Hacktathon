"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import ProductCard from "@/app/component/ProductCard";
import { ProductGridSkeleton } from "@/app/component/ProductCardSkeleton";
import { useProducts, findProduct } from "@/lib/useProducts";
import { addToCart } from "@/lib/cart";
import { useWishlist } from "@/lib/useWishlist";

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

const SIZE_ORDER = ["Small", "Medium", "Large", "X-Large"];

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { products, loading, error } = useProducts();
  const { mounted: wlMounted, has, toggle } = useWishlist();

  const product = useMemo(() => findProduct(products, id), [products, id]);
  const related = useMemo(
    () =>
      products
        .filter((p) => p._id !== id && p.category === product?.category)
        .slice(0, 4),
    [products, id, product]
  );

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "care" | "shipping">("details");

  // Reset selections when the product changes
  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.colors?.[0] ?? "");
    setSelectedSize(product.sizes?.[0] ?? "");
    setQuantity(1);
    setActiveImage(0);
    setAdded(false);
  }, [product]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container-shop py-10 min-h-[60vh]">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="animate-pulse rounded-2xl bg-gray-200 h-[420px]" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="h-24 w-full rounded bg-gray-200" />
              <div className="h-12 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-xl font-bold">{error || "Product not found"}</p>
          <p className="text-gray-500 text-sm">It may have been removed or the link is incorrect.</p>
          <Link href="/shop/casual" className="btn-primary h-[48px] px-8">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const originalPrice = product.discountPercent
    ? (product.price / (1 - product.discountPercent / 100)).toFixed(2)
    : null;
  const saved = wlMounted && has(product._id);

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

  const gallery = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop/casual" className="hover:underline">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container-shop py-8 md:py-12">
        <div className="flex md:flex-row flex-col gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="md:w-1/2 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`w-14 h-14 sm:w-[76px] sm:h-[76px] rounded-xl overflow-hidden bg-[#F0F0F0] border-2 transition-colors ${
                    activeImage === i ? "border-black" : "border-transparent hover:border-black/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 bg-[#F0F0F0] rounded-2xl overflow-hidden h-[340px] sm:h-[420px] lg:h-[500px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent ? (
                <span className="absolute top-4 left-4 bg-[#FF3333] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  -{product.discountPercent}%
                </span>
              ) : product.isNew ? (
                <span className="absolute top-4 left-4 bg-white/95 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  NEW
                </span>
              ) : null}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-sm">★★★★★</span>
              <span className="text-sm text-gray-500">4.8/5 · 150+ reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl md:text-3xl font-bold">${product.price}</span>
              {originalPrice && (
                <>
                  <span className="text-lg line-through text-gray-400">${originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium mb-2">
                  Select Color: <span className="capitalize font-bold">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                      aria-pressed={selectedColor === color}
                      title={color}
                      className={`w-9 h-9 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-black ring-offset-2"
                          : "border border-black/15 hover:scale-110"
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color.toLowerCase()] || color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Choose Size</p>
                  <span className="text-xs text-gray-400">Size guide</span>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {[...(product.sizes ?? [])]
                    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
                    .map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selectedSize === size}
                        className={`rounded-full text-sm px-5 h-[42px] flex items-center justify-center transition-colors ${
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

            {/* Quantity + actions */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <div className="flex items-center justify-between bg-[#F0F0F0] px-3 rounded-full w-[140px] h-[52px] shrink-0">
                <button
                  className="w-9 text-lg font-semibold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button
                  className="w-9 text-lg font-semibold"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button className="btn-primary px-8 h-[52px] flex-1 min-w-[160px] text-sm font-medium" onClick={handleAddToCart}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>

              <button
                onClick={() =>
                  toggle({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl,
                    category: product.category,
                  })
                }
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={saved}
                className={`btn-outline h-[52px] w-[52px] p-0 shrink-0 ${saved ? "!border-black/20" : ""}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill={saved ? "#FF3333" : "none"}
                  stroke={saved ? "#FF3333" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>

            {added && (
              <Link href="/cart" className="inline-block mt-4 text-sm font-semibold underline underline-offset-4">
                View Cart →
              </Link>
            )}

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-black/10">
              {[
                { title: "Free Shipping", sub: "On orders over $100", icon: "M2 7h11v8H2zM13 10h4l3 3v2h-7z" },
                { title: "Easy Returns", sub: "30-day policy", icon: "M3 12a9 9 0 1 0 2.6-6.4L3 8" },
                { title: "Secure Payment", sub: "Stripe protected", icon: "M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z" },
              ].map((t) => (
                <div key={t.title} className="flex flex-col items-center text-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-black/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                  <p className="font-bold text-xs">{t.title}</p>
                  <p className="text-[11px] text-gray-500">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 md:mt-16 border border-black/10 rounded-2xl overflow-hidden">
          <div className="flex border-b border-black/10 bg-[#FAFAFA] overflow-x-auto">
            {(
              [
                ["details", "Product Details"],
                ["care", "Care & Material"],
                ["shipping", "Shipping & Returns"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === key ? "bg-white border-b-2 border-black -mb-px" : "text-gray-500 hover:text-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-5 md:p-6 text-sm text-gray-600 leading-relaxed">
            {tab === "details" && (
              <div className="space-y-2">
                <p>{product.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Category: <span className="capitalize font-medium text-black">{product.category || "—"}</span></li>
                  <li>Available colors: {product.colors?.join(", ") || "—"}</li>
                  <li>Available sizes: {product.sizes?.join(", ") || "—"}</li>
                </ul>
              </div>
            )}
            {tab === "care" && (
              <ul className="list-disc pl-5 space-y-1">
                <li>Machine wash cold with like colors</li>
                <li>Do not bleach; tumble dry low</li>
                <li>Warm iron if needed, avoid printed areas</li>
              </ul>
            )}
            {tab === "shipping" && (
              <ul className="list-disc pl-5 space-y-1">
                <li>Free standard shipping on orders over $100</li>
                <li>Flat $15 delivery otherwise; 3–6 business days</li>
                <li>Free 30-day returns, no questions asked</li>
              </ul>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-14 md:mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold uppercase">You May Also Like</h2>
              <Link href="/shop/casual" className="text-sm font-medium underline underline-offset-4 hover:no-underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} detailHref={`/product/${p._id}`} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
