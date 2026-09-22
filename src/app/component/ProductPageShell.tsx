"use client";

import { useMemo } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import ProductDetail from "@/app/component/ProductDetail";
import { useProducts, findProduct } from "@/lib/useProducts";

export default function ProductPageShell({
  id,
  breadcrumb,
  backHref,
}: {
  id: string;
  breadcrumb: string;
  backHref: string;
}) {
  const { products, loading, error } = useProducts();

  const product = useMemo(() => findProduct(products, id), [products, id]);

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
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-xl font-bold">{error || "Product not found"}</p>
          <p className="text-gray-500 text-sm">It may have been removed or the link is incorrect.</p>
          <Link href={backHref} className="btn-primary h-[48px] px-8">
            Back to {breadcrumb}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return <ProductDetail product={product} breadcrumb={breadcrumb} backHref={backHref} />;
}
