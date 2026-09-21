"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { client } from "@/sanity/lib/client";
import { addToCart } from "@/lib/cart";
import { FaStar } from "react-icons/fa";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  discountPercent?: number;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "products" && (name match $q + "*" || description match $q + "*" || category match $q + "*")]{
          _id, name, description, price,
          "imageUrl": image.asset->url,
          category, discountPercent
        }`;
        const data = await client.fetch(query, { q });
        setProducts(data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="container-shop py-10 min-h-[60vh]">
      <h1 className="text-2xl font-extrabold mb-2">
        {q ? `Search results for "${q}"` : "All Products"}
      </h1>
      <p className="text-gray-500 mb-8">
        {loading ? "Searching..." : `${products.length} product(s) found`}
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold mb-2">No products found</p>
          <p className="text-gray-500">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="group">
              <Link href={`/productOne/${product._id}`} className="block relative h-[301px] w-full overflow-hidden rounded-xl bg-gray-100">
                <Image
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  src={product.imageUrl}
                  width={285}
                  height={301}
                />
              </Link>
              <div className="pt-3">
                <h3 className="font-bold text-base">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-1">{product.category}</p>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-3.5 w-3.5 text-yellow-500" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    ${product.price}
                    {product.discountPercent && (
                      <span className="text-gray-500 line-through ml-2 text-sm">
                        ${(product.price / (1 - product.discountPercent / 100)).toFixed(2)}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.imageUrl,
                      })
                    }
                    className="text-xs font-semibold bg-black text-white rounded-full px-4 py-2 hover:bg-black/80 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
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
