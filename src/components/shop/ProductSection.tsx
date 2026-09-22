"use client";

import { useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/app/component/ProductCard";
import { ProductGridSkeleton } from "@/app/component/ProductCardSkeleton";
import { useProducts } from "@/lib/useProducts";
import type { Product } from "@/lib/types";

type SectionKind = "new-arrivals" | "top-selling";

const TITLES: Record<SectionKind, string> = {
  "new-arrivals": "New Arrivals",
  "top-selling": "Top Selling",
};

export default function ProductSection({ kind }: { kind: SectionKind }) {
  const { products, loading, error } = useProducts();

  const items = useMemo(() => {
    if (kind === "new-arrivals") return products.slice(0, 4);
    return [...products]
      .filter((p) => (p.discountPercent ?? 0) > 0)
      .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
      .slice(0, 4);
  }, [products, kind]);

  return (
    <section className="py-12 md:py-16">
      <div className="container-shop">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold uppercase mb-10">
          {TITLES[kind]}
        </h2>

        {error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : loading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((product: Product) => (
              <ProductCard key={product._id} product={product} detailHref={`/product/${product._id}`} />
            ))}
          </div>
        )}
      </div>
      {kind === "new-arrivals" && (
        <div className="text-center mt-10">
          <Link href="/shop/casual" className="btn-outline h-[52px] px-10 font-medium">
            View All
          </Link>
        </div>
      )}
    </section>
  );
}
