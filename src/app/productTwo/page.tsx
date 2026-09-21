"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import ProductCard from "../component/ProductCard";

const PRODUCT_FIELDS = `
  _id, name, description, price,
  "imageUrl": image.asset->url,
  category, discountPercent
`;

export default function SecThree2() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type=="products"] | order(_createdAt desc) [4..7]{${PRODUCT_FIELDS}}`)
      .then((data: any[]) => setProducts(data || []))
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12">
      <div className="container-shop">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold uppercase mb-10">
          Top Selling
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                detailHref={`/productTwo/${product._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
