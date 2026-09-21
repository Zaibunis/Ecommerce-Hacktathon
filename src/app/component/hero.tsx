import Image from "next/image";
import Link from "next/link";

function Sparkle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`absolute text-black pointer-events-none ${className}`}
      style={{ animation: `sparkle-pulse 2.4s ease-in-out ${delay}s infinite` }}
    >
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" />
    </svg>
  );
}

function Starburst({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`absolute text-black pointer-events-none ${className}`}
      style={{ animation: `sparkle-pulse 2.4s ease-in-out ${delay}s infinite` }}
    >
      <path d="M11 2h2v7.2l5-5 1.4 1.4-5 5H22v2h-7.6l5 5-1.4 1.4-5-5V22h-2v-7.2l-5 5L4.6 18.4l5-5H2v-2h7.6l-5-5L6 5l5 5V2z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-[#F2F0F1] overflow-hidden">
      {/* Decorative animated sparkles */}
      <Sparkle className="w-10 h-10 md:w-14 md:h-14 top-[12%] left-[45%] md:left-[52%]" delay={0} />
      <Starburst className="w-6 h-6 md:w-8 md:h-8 top-[6%] left-[55%] md:left-[62%]" delay={0.6} />
      <Sparkle className="w-8 h-8 md:w-12 md:h-12 bottom-[14%] right-[4%] md:right-[8%]" delay={1.2} />
      <Starburst className="w-5 h-5 md:w-6 md:h-6 bottom-[30%] right-[16%] md:right-[20%]" delay={0.3} />
      <Sparkle className="w-6 h-6 top-[40%] left-[2%] md:left-[6%] opacity-70" delay={0.9} />

      <div className="container-shop flex flex-col-reverse lg:flex-row items-center justify-between py-10 lg:py-16 gap-10">
        {/* Left content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="font-integral text-4xl md:text-5xl xl:text-[64px] xl:leading-[64px] font-black tracking-tight text-black leading-tight">
            FIND CLOTHES
            <br />
            THAT MATCHES
            <br />
            YOUR STYLE
          </h1>
          <p className="mt-5 text-sm md:text-base text-black/60 max-w-[520px] mx-auto lg:mx-0">
            Browse through our diverse range of meticulously crafted garments, designed to
            bring out your individuality and cater to your sense of style.
          </p>

          <div className="flex justify-center lg:justify-start mt-6">
            <Link
              href="/comp/casual"
              className="btn-primary w-full sm:w-[210px] h-[52px] lg:h-[56px] text-base font-medium"
            >
              Shop Now
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-10 mt-10 flex-wrap">
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-bold text-3xl md:text-[40px] leading-none">200+</span>
              <span className="text-xs md:text-base text-black/60 mt-1">International Brands</span>
            </div>
            <div className="w-px h-10 md:h-14 bg-black/10" />
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-bold text-3xl md:text-[40px] leading-none">2,000+</span>
              <span className="text-xs md:text-base text-black/60 mt-1">High-Quality Products</span>
            </div>
            <div className="w-px h-10 md:h-14 bg-black/10" />
            <div className="flex flex-col items-center lg:items-start">
              <span className="font-bold text-3xl md:text-[40px] leading-none">30,000+</span>
              <span className="text-xs md:text-base text-black/60 mt-1">Happy Customers</span>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="lg:w-1/2 flex items-center justify-center relative">
          <div className="relative">
            <Image
              src="/Rectangle 2.png"
              alt="Fashion Style"
              width={540}
              height={620}
              priority
              className="rounded-xl object-cover max-h-[520px] w-auto"
            />
            <Sparkle className="w-12 h-12 md:w-16 md:h-16 -top-2 -left-4" delay={0.2} />
            <Starburst className="w-10 h-10 md:w-14 md:h-14 bottom-16 right-4" delay={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
