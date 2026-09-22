"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const DISMISS_KEY = "welcomePromoDismissed";

/**
 * Shows once for authenticated users: "You got 20% off" toast.
 * Ties into the existing cart promo logic (code DISCOUNT20).
 */
export default function WelcomePromo() {
  const { isLoaded, isSignedIn } = useUser();
  const [visible, setVisible] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) === "true") return;
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!applied) return;
    const t = setTimeout(() => {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, "true");
    }, 3000);
    return () => clearTimeout(t);
  }, [applied]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  const applyCode = () => {
    localStorage.setItem("promoApplied", "true");
    window.dispatchEvent(new Event("shopco:cart-updated"));
    setApplied(true);
  };

  if (!isLoaded || !isSignedIn || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl bg-white shadow-2xl border border-black/10 p-5 animate-[fade-up_0.35s_ease-out]"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
      >
        ✕
      </button>

      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">🎉</span>
        <div>
          <p className="font-extrabold text-base">You got 20% off!</p>
          {applied ? (
            <p className="text-sm text-gray-600 mt-1">
              Discount applied — it will show in your cart at checkout.
            </p>
          ) : (
            <p className="text-sm text-gray-600 mt-1">
              Thanks for joining SHOP.CO. Use code{" "}
              <span className="font-bold text-black">DISCOUNT20</span> at checkout.
            </p>
          )}
        </div>
      </div>

      {!applied && (
        <div className="flex items-center gap-2 mt-4">
          <button onClick={applyCode} className="btn-primary h-[40px] px-5 text-sm font-medium flex-1">
            Apply 20% Off
          </button>
          <Link
            href="/shop/casual"
            onClick={dismiss}
            className="btn-outline h-[40px] px-4 text-sm"
          >
            Shop now
          </Link>
        </div>
      )}
    </div>
  );
}
