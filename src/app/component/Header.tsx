"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { DynamicSignInButton, DynamicUserButton } from "./DynamicClerkComponents";
import { useCart } from "@/lib/useCart";
import { useWishlist } from "@/lib/useWishlist";

const NAV_LINKS = [
  { label: "On Sale", href: "/comp/casual" },
  { label: "New Arrivals", href: "/comp/mens-clothes" },
  { label: "Brands", href: "/comp/casual" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { items, mounted } = useCart();
  const count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0;
  const { items: wishlistItems, mounted: wlMounted } = useWishlist();
  const wishlistCount = wlMounted ? wishlistItems.length : 0;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleShop = () => setIsShopOpen(!isShopOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="w-full h-[38px] flex items-center justify-center bg-black text-white font-integral px-4">
        <SignedOut>
          <span className="text-xs sm:text-sm text-center">
            Sign up and get 20% off your first order.
            <Link href="/component/authentication" className="underline ml-2 whitespace-nowrap">
              Sign Up Now
            </Link>
          </span>
        </SignedOut>
        <SignedIn>
          <span className="text-xs sm:text-sm text-center">
            You got 20% off your first order — code DISCOUNT20 at checkout 🎉
          </span>
        </SignedIn>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-[20px] sm:px-[100px] py-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Shop.co home">
            <Image src="/SHOP.CO.png" alt="Shop.co" width={141} height={22} priority />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-12">
            <li>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent px-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-base">Shop</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[260px] py-3 px-5 bg-white shadow-lg rounded-lg">
                      <NavigationMenuLink className="text-base text-black/80 block py-2.5 hover:text-black hover:underline underline-offset-4">
                        <Link href="/comp/casual">Casual</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="text-base text-black/80 block py-2.5 hover:text-black hover:underline underline-offset-4">
                        <Link href="/comp/mens-clothes">Mens-Clothes</Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`hover:underline whitespace-nowrap ${
                    isActive(link.href) ? "underline underline-offset-4 font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search + cart + auth */}
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-[140px] lg:w-[240px] h-[40px] rounded-full bg-[#F0F0F0] pl-10 pr-4 text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all focus:w-[260px] lg:focus:w-[300px]"
            />
            <button type="submit" aria-label="Search" className="absolute left-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>

          <Link href="/comp/wishlist" className="relative" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {wlMounted && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/comp/cart" className="relative" aria-label="Cart">
            <Image src="/Frame (3).png" alt="Cart" width={24} height={24} />
            {mounted && count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          <div className="flex items-center">
            <SignedOut>
              <DynamicSignInButton mode="modal" />
            </SignedOut>
            <SignedIn>
              <DynamicUserButton />
            </SignedIn>
          </div>

          {/* Hamburger */}
          <button className="md:hidden flex items-center" onClick={toggleMenu} aria-label="Menu">
            <div className="w-6 flex flex-col space-y-1">
              <div className="w-6 h-[2px] bg-black" />
              <div className="w-6 h-[2px] bg-black" />
              <div className="w-6 h-[2px] bg-black" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-5 py-4 border-b border-black/5 shadow-sm">
          <form onSubmit={handleSearch} className="mb-3 sm:hidden">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full h-[44px] rounded-full bg-[#F0F0F0] px-4 text-sm placeholder:text-black/40 focus:outline-none"
            />
          </form>
          <ul>
            <li className="py-2">
              <Link href="/comp/wishlist" className="block hover:underline" onClick={toggleMenu}>
                Wishlist
              </Link>
            </li>
            <li className="py-2">
              <button onClick={toggleShop} className="block hover:underline w-full text-left font-medium">
                Shop
              </button>
              {isShopOpen && (
                <ul className="pl-4">
                  <li className="py-2">
                    <Link href="/comp/casual" className="block hover:underline" onClick={toggleMenu}>
                      Casual
                    </Link>
                  </li>
                  <li className="py-2">
                    <Link href="/comp/mens-clothes" className="block hover:underline" onClick={toggleMenu}>
                      Mens-Clothes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {NAV_LINKS.map((link) => (
              <li className="py-2" key={link.label}>
                <Link href={link.href} className="block hover:underline" onClick={toggleMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
