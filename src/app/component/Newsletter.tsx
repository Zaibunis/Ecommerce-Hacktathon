"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="container-shop my-12 md:my-20">
      <div className="w-full bg-black rounded-[20px] lg:rounded-[40px] py-12 px-6 md:px-16 flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="text-center lg:text-left">
          <h2 className="text-white text-2xl md:text-4xl font-extrabold leading-tight uppercase">
            Stay Up To Date About
            <br /> Our Latest Offers
          </h2>
          <p className="text-white/60 text-sm mt-4 max-w-sm mx-auto lg:mx-0">
            Join the newsletter — new drops, exclusive discounts and early access, straight to your inbox.
          </p>
        </div>

        <div className="w-full max-w-[420px]">
          {status === "success" ? (
            <div className="h-[132px] flex flex-col items-center justify-center gap-3 text-center">
              <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <FaCheck className="text-white text-xl" />
              </span>
              <p className="text-white font-semibold">You&apos;re on the list! 🎉</p>
              <p className="text-white/60 text-sm">Watch your inbox for 20% off your first order.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Enter your email address"
                  className={`w-full h-[48px] pl-11 pr-4 rounded-full bg-white text-black text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 ${
                    status === "error" ? "ring-2 ring-red-500" : "focus:ring-black/30"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full h-[48px] bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm"
              >
                Subscribe to Newsletter
              </button>
              {status === "error" && (
                <p className="text-red-400 text-xs text-center">
                  Please enter a valid email address.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
      </div>
  );
}
