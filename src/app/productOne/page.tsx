"use client";

import { useMemo } from "react";
import { useProducts } from "@/lib/useProducts";
import ProductCard from "../component/ProductCard";
import { ProductGridSkeleton } from "../component/ProductCardSkeleton";

const RANGE = { start: 0, end: 4 };

export default function SecThree() {
  const { products, loading, error } = useProducts();

  const items = useMemo(
    () => products.slice(RANGE.start, RANGE.end),
    [products]
  );

  return (
    <section className="py-12 md:py-16">
      <div className="container-shop">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold uppercase mb-10">
          New Arrivals
        </h2>

        {error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : loading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} detailHref={`/productOne/${product._id}`} />
            ))}
          </div>
        )}
      </div>
      <div className="text-center mt-10">
        <a href="/comp/casual" className="btn-outline h-[52px] px-10 font-medium">View All</a>
      </div>
    </section>
  );
}
