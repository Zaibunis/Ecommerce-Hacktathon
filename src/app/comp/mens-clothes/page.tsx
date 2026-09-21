"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/app/component/ProductCard";


type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  discountPercent?: number;
};

export default function MensClothesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(
          `*[_type=="products"][8..12]{
            _id, name, description, price,
            "imageUrl": image.asset->url,
            category, discountPercent
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

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

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
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-extrabold">Mens-Clothes</h1>
          <div className="text-sm text-gray-500 flex items-center gap-4">
            <span>Showing {products.length} products</span>
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                detailHref={`/productThree/${product._id}`}
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
