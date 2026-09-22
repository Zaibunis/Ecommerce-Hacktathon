"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { clearCart, getCart, getTotals } from "@/lib/cart";

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Order is complete — record it in the database, then clear the cart
    const finalize = async () => {
      try {
        const items = getCart();
        if (items.length > 0) {
          await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items, total: getTotals(items).total }),
          });
        }
      } catch {
        // Never block the success page on order recording
      }
      await fetch("/api/cart", { method: "DELETE" }).catch(() => {});
      clearCart();
    };
    finalize();
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase{amount ? ` of $${amount}` : ""}. Your order is on its way.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary h-[52px] px-8 font-medium">
          Back to Home
        </Link>
        <Link href="/comp/casual" className="btn-outline h-[52px] px-8 font-medium">
          Continue Shopping
        </Link>
      </div>
      <Image src="/SHOP.CO.png" alt="Shop.co" width={120} height={20} className="mt-12 opacity-40" />
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
