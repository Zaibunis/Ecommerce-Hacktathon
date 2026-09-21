"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../Header";
import Footer from "../Footer";
import Newsletter from "../Newsletter";
import { useCart } from "@/lib/useCart";
import { getTotals } from "@/lib/cart";

const StripePayment = dynamic(() => import("../StripePayment/page"), { ssr: false });

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const Page: React.FC = () => {
  const { items: cart, mounted } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (mounted && cart.length === 0) {
      setShowErrorPopup(false);
    }
  }, [mounted, cart.length]);

  const totals = mounted ? getTotals(cart) : { subtotal: 0, discount: 0, delivery: 0, total: 0 };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cartTotal = totals.total;

  return (
    <div>
      <Header />

      {/* Breadcrumb */}
      <div className="container-shop mt-5">
        <nav className="text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Checkout</span>
        </nav>
      </div>

      {/* Progress indicator */}
      <div className="max-w-4xl mt-5 mx-auto mb-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-sm">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-black/10 mx-3 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-sm">Payment</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-center mb-8 px-4">Checkout</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 pb-12">
        {/* Order summary */}
        <div className="bg-[#F0F0F0] p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <a href="/comp/casual" className="btn-outline h-[44px] px-6 text-sm">
                Browse Products
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-black/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Discount (-20%)</span>
                    <span>− ${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span>${totals.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/10">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Billing + payment */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-[#F0F0F0] p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold mb-4">Billing Details</h2>
          <div className="space-y-3">
            {[
              { name: "name", label: "Full Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "address", label: "Address", type: "text" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "city", label: "City" },
                { name: "state", label: "State" },
                { name: "zip", label: "ZIP Code" },
                { name: "country", label: "Country" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type="text"
                    name={f.name}
                    value={formData[f.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Payment Method</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="payment" value="stripe" defaultChecked className="form-radio h-4 w-4" />
              <span>Stripe (Card)</span>
            </label>
          </div>

          {/* Stripe payment element (uses real cart total) */}
          <div className="w-full mt-4">
            {cart.length > 0 && mounted ? (
              <StripePayment />
            ) : null}
          </div>
        </form>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Page;
