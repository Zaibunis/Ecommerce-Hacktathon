"use client";

import Image from "next/image";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="container-shop my-10">
      <div className="w-full bg-black rounded-[20px] lg:rounded-[40px] py-10 px-6 md:px-16 flex flex-col lg:flex-row justify-between items-center gap-6">
        <span className="text-white text-2xl md:text-4xl font-extrabold leading-tight text-center lg:text-left">
          STAY UP TO DATE ABOUT
          <br /> OUR LATEST OFFERS
        </span>

        <div className="flex flex-col gap-3 w-full max-w-[400px]">
          <form onSubmit={handleSubscribe} className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Image src="/Frame (8).png" width={22} height={22} alt="" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-[48px] pl-12 pr-4 rounded-full bg-white text-black text-sm placeholder:text-black/40 focus:outline-none"
            />
          </form>
          <button
            type="submit"
            onClick={handleSubscribe}
            className="w-full h-[48px] bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors text-sm"
          >
            Subscribe to Newsletter
          </button>
          {subscribed && (
            <p className="text-green-400 text-sm text-center">Thanks for subscribing! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
