"use client";

import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubCurrency from "../lib/ConvertToSubCurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setError] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Error fetching payment intent:", data);
          setError(data.error || "Failed to initialize payment");
        }
      })
      .catch((error) => {
        console.error("Error fetching payment intent:", error);
        setError("Failed to initialize payment");
      });
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not initialized. Please try again.");
      setLoading(false);
      return;
    }

    const { error: submitErrors } = await elements.submit();
    if (submitErrors) {
      setError(submitErrors.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {clientSecret ? (
        <PaymentElement />
      ) : (
        <p className="text-gray-500 text-sm py-4">Loading payment form...</p>
      )}
      <button
        className="btn-primary w-full h-[48px] mt-5 font-medium"
        disabled={!stripe || !elements || !clientSecret || loading}
      >
        {loading ? "Processing..." : `Pay Now — $${amount.toFixed(2)}`}
      </button>
      {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
    </form>
  );
};

export default CheckoutPage;
