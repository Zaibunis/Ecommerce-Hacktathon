"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "../component/footer";
import ProductDetail from "@/app/component/ProductDetail";
import { client } from "@/sanity/lib/client";

export default function ProductPageShell({
  id,
  breadcrumb,
  backHref,
}: {
  id: string;
  breadcrumb: string;
  backHref: string;
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = `*[_type=="products"]{
          _id, name, description, price,
          "imageUrl": image.asset->url,
          category, discountPercent, "isNew": new, colors, sizes
        }`;
        const fetched = await client.fetch(query);
        const found = fetched.find((item: { _id: string }) => item._id === id);

        if (found) {
          setProduct(found);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold">{error || "Product not found"}</p>
          <Link href={backHref} className="btn-primary h-[48px] px-6">
            Back to {breadcrumb}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return <ProductDetail product={product} breadcrumb={breadcrumb} backHref={backHref} />;
}
