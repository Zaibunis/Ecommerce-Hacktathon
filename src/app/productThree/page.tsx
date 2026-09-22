"use client";

import { useMemo } from "react";
import { useProducts } from "@/lib/useProducts";
import ProductCard from "../component/ProductCard";
import { ProductGridSkeleton } from "../component/ProductCardSkeleton";

// Casual Collection = category tshirt / hoodie
export default function SecThree3() {
  const { products, loading, error } = useProducts();

  const items = useMemo(
    () => products.filter((p) => ["tshirt", "hoodie"].includes((p.category ?? "").toLowerCase())).slice(0, 4),
    [products]
  );

  return (
    <section className="py-12 md:py-16">
      <div className="container-shop">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold uppercase mb-10">
          Casual Collection
        </h2>

        {error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : loading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} detailHref={`/productThree/${product._id}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
