"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import ProductCard from "../component/ProductCard";
import { ProductGridSkeleton } from "../component/ProductCardSkeleton";
import { useProducts } from "@/lib/useProducts";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").toLowerCase();
  const { products, loading } = useProducts();

  const results = useMemo(() => {
    if (!q) return products;
    const words = q.split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      const haystack = `${p.name} ${p.description} ${p.category ?? ""}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [products, q]);

  return (
    <div className="container-shop py-10 min-h-[60vh]">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
        {q ? `Search results for "${q}"` : "All Products"}
      </h1>
      <p className="text-gray-500 mb-8">
        {loading ? "Searching..." : `${results.length} product(s) found`}
      </p>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2">No products found</p>
          <p className="text-gray-500">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {results.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              detailHref={`/product/${product._id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}
