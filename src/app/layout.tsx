import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WelcomePromo from "./component/WelcomePromo";

export const metadata: Metadata = {
  title: "SHOP.CO — Fashion that fits your style",
  description:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <WelcomePromo />
        </body>
      </html>
    </ClerkProvider>
  )
}
