"use client";

import Link from "next/link";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Newsletter from "@/app/component/Newsletter";
import { useWishlist } from "@/lib/useWishlist";
import { addToCart } from "@/lib/cart";

export default function WishlistPage() {
  const { items, mounted, remove, toggle } = useWishlist();

  const moveAllToCart = () => {
    items.forEach((i) => addToCart(i, 1));
  };

  return (
    <div>
      <Header />

      <div className="container-shop py-10 min-h-[60vh]">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Wishlist</h1>

        {!mounted ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[300px] rounded-xl bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200 mt-3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-black/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <p className="text-xl font-semibold mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 mb-6">Tap the heart on any product to save it here.</p>
            <Link href="/comp/casual" className="btn-primary h-[52px] px-8">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button onClick={moveAllToCart} className="btn-primary h-[44px] px-6 text-sm font-medium">
                Move All to Cart
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative h-[240px] md:h-[280px] w-full overflow-hidden rounded-2xl bg-[#F0F0F0]">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/30 text-sm">No image</div>
                    )}
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur shadow-sm flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#FF3333]" fill="#FF3333" stroke="#FF3333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="absolute inset-x-3 bottom-3 h-[40px] rounded-full bg-black/85 backdrop-blur text-white text-sm font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black"
                    >
                      + Add to Cart
                    </button>
                  </div>
                  <div className="pt-3.5">
                    <h3 className="font-bold text-base truncate">{item.name}</h3>
                    {item.category && (
                      <p className="text-black/50 text-xs capitalize">{item.category}</p>
                    )}
                    <p className="font-bold text-lg mt-1">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}
