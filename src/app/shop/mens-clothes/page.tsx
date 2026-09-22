"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import ProductCard from "@/app/component/ProductCard";
import { ProductCardSkeleton } from "@/app/component/ProductCardSkeleton";
import SortSelect from "@/app/component/SortSelect";
import { useProducts } from "@/lib/useProducts";

export default function MensClothesPage() {
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState("popular");

  // Mens-Clothes = every other category (formal-ish: shirt, jeans, short)
  const items = useMemo(
    () => products.filter((p) => ["shirt", "jeans", "short"].includes((p.category ?? "").toLowerCase())),
    [products]
  );

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
      }),
    [items, sortBy]
  );

  return (
    <div>
      <Header />

      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Mens-Clothes</span>
        </nav>
      </div>

      <div className="container-shop py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Mens-Clothes</h1>
          <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap">
            <span>Showing {sorted.length} products</span>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {error ? (
          <p className="text-center text-red-500 py-16">{error}</p>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-semibold mb-2">No products found</p>
            <p className="text-gray-500 text-sm">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                detailHref={`/product/${product._id}`}
              />
            ))}
          </div>
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
