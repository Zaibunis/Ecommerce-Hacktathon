"use client";

import convertToSubCurrency from "../../lib/ConvertToSubCurrency";
import CheckoutPage from "../CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { getTotals, getCart } from "@/lib/cart";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) return;
    const totals = getTotals(cart);
    setAmount(totals.total);
  }, []);

  if (amount === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">
        Your cart is empty — add items before paying.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubCurrency(amount),
        currency: "usd",
      }}
    >
      <CheckoutPage amount={amount} />
    </Elements>
  );
};

export default StripePayment;
