"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/app/component/ProductCard";
import Link from "next/link";


type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  discountPercent?: number;
  colors?: string[];
  sizes?: string[];
};

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

export default function CasualPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(
          `*[_type=="products"][0..8]{
            _id, name, description, price,
            "imageUrl": image.asset->url,
            category, discountPercent, colors, sizes
          }`
        );
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
    let list = products.filter(
      (p) => p.price <= maxPrice
    );
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-extrabold">Casual</h1>
          <div className="text-sm text-gray-500 flex items-center gap-4">
            <span>Showing {filtered.length} products</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-black/10 rounded-full px-4 py-2 text-sm bg-white focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            <div className="border border-black/10 rounded-2xl p-5 bg-white">
              <h3 className="font-bold mb-3">Price</h3>
              <input
                type="range"
                min={50}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black"
              />
              <p className="text-sm text-gray-600 mt-2">Up to ${maxPrice}</p>
            </div>

            {availableColors.length > 0 && (
              <div className="border border-black/10 rounded-2xl p-5 bg-white">
                <h3 className="font-bold mb-3">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      title={color}
                      aria-label={color}
                      className={`w-7 h-7 rounded-full border transition-transform ${
                        selectedColors.includes(color)
                          ? "ring-2 ring-black ring-offset-2 scale-110"
                          : "border-black/10"
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color] || color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="border border-black/10 rounded-2xl p-5 bg-white">
                <h3 className="font-bold mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-600 border-black/10 hover:border-black/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(selectedColors.length > 0 || selectedSizes.length > 0 || maxPrice < 200) && (
              <button
                onClick={() => {
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setMaxPrice(200);
                }}
                className="btn-outline w-full h-[44px] text-sm"
              >
                Clear Filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-semibold mb-2">No products match your filters</p>
                <p className="text-gray-500 text-sm">Try widening your price range or clearing filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    detailHref={`/productFour/${product._id}`}
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
