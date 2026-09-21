"use client";

import ProductPageShell from "@/app/component/ProductPageShell";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductPageShell id={params.id} breadcrumb="Mens-Clothes" backHref="/comp/mens-clothes" />;
}
