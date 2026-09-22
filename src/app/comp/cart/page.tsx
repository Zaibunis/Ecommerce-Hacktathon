"use client";

import { useCart } from "@/lib/useCart";
import { getTotals } from "@/lib/cart";
import { useState } from "react";
import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";

export default function CartPage() {
  const { items, mounted, setQuantity, remove } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!mounted) return <div className="min-h-[60vh]" />;

  const totals = getTotals(items);

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === "DISCOUNT20") {
      localStorage.setItem("promoApplied", "true");
      setPromoError("");
      window.dispatchEvent(new Event("shopco:cart-updated"));
    } else {
      setPromoError("Invalid promo code. Try DISCOUNT20");
    }
  };

  return (
    <div>
      <Header />

      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Cart</span>
        </nav>
      </div>

      <div className="container-shop py-10">
      <h1 className="text-3xl font-extrabold mb-8">YOUR CART</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-semibold mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <Link href="/comp/casual" className="btn-primary h-[52px] px-8">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-black/10 rounded-2xl p-4 bg-white"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-bold text-base">{item.name}</p>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                    <p className="font-bold mt-2">${item.price}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove item"
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                  <div className="flex items-center bg-[#F0F0F0] rounded-full">
                    <button
                      className="w-9 h-9 flex items-center justify-center text-black"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      className="w-9 h-9 flex items-center justify-center text-black"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border border-black/10 p-6 rounded-2xl bg-white h-fit">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p className="font-bold">${totals.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Discount (-20%)</p>
                <p className={totals.discount > 0 ? "text-red-500 font-medium" : "text-gray-400"}>
                  − ${totals.discount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Delivery Fee</p>
                <p className="font-bold">${totals.delivery.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-4">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-lg font-bold">${totals.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Add promo code"
                  className="w-full h-[48px] border border-black/10 rounded-full pl-4 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              {promoError && <p className="text-red-500 text-xs">{promoError}</p>}
              <button onClick={applyPromo} className="btn-primary w-full h-[48px] text-sm font-medium">
                Apply
              </button>
              <Link
                href="/component/checkout"
                className="btn-primary w-full h-[48px] text-sm font-medium gap-2"
              >
                Go to Checkout →
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
