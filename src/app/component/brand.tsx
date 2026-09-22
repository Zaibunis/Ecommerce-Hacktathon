import Image from "next/image";

const brandsData: { id: string; srcUrl: string }[] = [
  { id: "versace", srcUrl: "/Group (1).png" },
  { id: "zara", srcUrl: "/zara-logo-1 1.png" },
  { id: "gucci", srcUrl: "/gucci-logo-1 1.png" },
  { id: "prada",  srcUrl: "/prada-logo-1 1.png" },
  { id: "calvin-klein", srcUrl: "/calvinKlein.png" },
];

/** Brands rendered twice for a seamless -50% translateX loop */
export default function Brands() {
  const loop = [...brandsData, ...brandsData];

  return (
    <div className="bg-black py-7 md:py-9 overflow-hidden" aria-label="Featured brands">
      <div className="flex w-max animate-marquee items-center md:hover:[animation-play-state:paused]">
        {loop.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            aria-hidden={i >= brandsData.length}
            className="flex items-center justify-center px-8 sm:px-12"
          >
            <Image
              src={brand.srcUrl}
              height={33}
              width={166}
              alt={i >= brandsData.length ? "" : brand.id}
              className="h-auto w-auto max-w-[116px] lg:max-w-40 max-h-[26px] lg:max-h-9 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          ))}
      </div>
    </div>
  );
}
