"use client";

import Header from "../Header";
import Footer from "../footer";
import { SignIn } from "@clerk/nextjs";

export default function AuthenticationPage() {
  return (
    <div>
      <Header />
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl font-extrabold mb-2 text-center">Welcome to SHOP.CO</h1>
        <p className="text-gray-500 mb-8 text-center">Sign in to your account to continue</p>
        <SignIn signUpUrl="/component/authentication" />
      </div>
      <Footer />
    </div>
  );
}
