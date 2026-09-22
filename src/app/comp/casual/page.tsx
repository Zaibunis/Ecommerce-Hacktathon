"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "../../component/Footer";
import Newsletter from "@/app/component/Newsletter";
import ProductCard from "@/app/component/ProductCard";
import { ProductCardSkeleton } from "@/app/component/ProductCardSkeleton";
import SortSelect from "@/app/component/SortSelect";
import { useProducts } from "@/lib/useProducts";
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

const SIZE_ORDER = ["Small", "Medium", "Large", "X-Large"];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/5 last:border-0 py-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold uppercase tracking-wide">{title}</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-black/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>{children}</div>
    </div>
  );
}

export default function CasualPage() {
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c.toLowerCase())));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list: Product[] = products.filter((p) => p.price <= maxPrice);
    if (selectedSizes.length > 0) {
      list = list.filter((p) => p.sizes?.some((s) => selectedSizes.includes(s)));
    }
    if (selectedColors.length > 0) {
      list = list.filter((p) => p.colors?.some((c) => selectedColors.includes(c.toLowerCase())));
    }
    return [...list].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [products, maxPrice, selectedSizes, selectedColors, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const hasFilters =
    selectedColors.length > 0 || selectedSizes.length > 0 || maxPrice < 300;

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setMaxPrice(300);
  };

  const FilterPanel = () => (
    <div>
      <FilterSection title="Price">
        <input
          type="range"
          min={50}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-black"
          aria-label="Maximum price"
        />
        <div className="flex justify-between text-xs text-black/50 mt-2">
          <span>$50</span>
          <span className="font-bold text-black">Up to ${maxPrice}</span>
          <span>$300</span>
        </div>
      </FilterSection>

      {availableColors.length > 0 && (
        <FilterSection title="Colors">
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                title={color}
                aria-label={`Filter by ${color}`}
                aria-pressed={selectedColors.includes(color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  selectedColors.includes(color)
                    ? "ring-2 ring-black ring-offset-2"
                    : "border border-black/15 hover:scale-110"
                }`}
                style={{ backgroundColor: COLOR_MAP[color] || color }}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {availableSizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                aria-pressed={selectedSizes.includes(size)}
                className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-black text-white border-black font-medium"
                    : "bg-gray-50 text-gray-600 border-black/10 hover:border-black/30"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {hasFilters && (
        <button onClick={clearFilters} className="btn-outline w-full h-[44px] text-sm mt-4 lg:hidden">
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      <Header />

      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Casual</span>
        </nav>
      </div>

      <div className="container-shop py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Casual</h1>
          <div className="text-sm text-gray-500 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="btn-outline h-[44px] px-5 gap-2 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="10" y1="17" x2="14" y2="17" />
              </svg>
              Filters
              {hasFilters && (
                <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {selectedColors.length + selectedSizes.length + (maxPrice < 300 ? 1 : 0)}
                </span>
              )}
            </button>
            <span className="hidden sm:inline">Showing {filtered.length} products</span>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile: slide-over filter drawer */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="relative ml-auto w-[320px] max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Close filters"
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          <aside
            className={`${isFilterOpen ? "block" : "hidden"} lg:block lg:w-[280px] flex-shrink-0 lg:sticky lg:top-24 self-start`}
          >
            <div className="border border-black/10 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-lg font-bold">Filters</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-black/50 hover:text-black underline underline-offset-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="px-5 pb-5">
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {error ? (
              <p className="text-center text-red-500 py-16">{error}</p>
            ) : loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-semibold mb-2">No products match your filters</p>
                <p className="text-gray-500 text-sm mb-4">
                  Try widening your price range or clearing filters.
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="btn-primary h-[44px] px-6 text-sm">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    detailHref={`/productOne/${product._id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
