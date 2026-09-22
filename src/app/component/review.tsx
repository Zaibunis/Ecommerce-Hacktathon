"use client";

import React, { useCallback, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Review = {
  name: string;
  rating: number;
  text: string;
};

const REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    name: "James L.",
    rating: 5,
    text: "I love how diverse the collection is on Shop.co. There is something for everyone, and I always find the latest trends! Highly recommended for fashion lovers!",
  },
  {
    name: "Monica B.",
    rating: 4,
    text: "Great quality and fast delivery. The fit guide on each product page is really accurate — my order arrived exactly as expected. Will definitely be shopping here again.",
  },
  {
    name: "Daniel R.",
    rating: 5,
    text: "The checkout was smooth and my order arrived early. Fabric quality is excellent for the price point. Shop.co has become my go-to for wardrobe refreshes.",
  },
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${filled ? "text-yellow-500" : "text-gray-300"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Verified
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="h-full rounded-2xl border border-black/10 bg-white p-6 md:p-7 flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < review.rating} />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-black text-base font-bold">{review.name}</h3>
        <VerifiedBadge />
      </div>

      <p className="leading-relaxed text-gray-600 text-sm md:text-[15px]">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

function CarouselArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
      onClick={onClick}
      disabled={disabled}
      className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg"
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}

const Review = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback((carouselApi: NonNullable<CarouselApi>) => {
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  const onApiSet = useCallback(
    (carouselApi: CarouselApi) => {
      setApi(carouselApi);
      if (!carouselApi) return;
      const embla = carouselApi;
      onSelect(embla);
      embla.on("select", () => onSelect(embla));
      embla.on("reInit", () => onSelect(embla));
    },
    [onSelect]
  );

  return (
    <section className="py-12 md:py-16">
      <div className="container-shop">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-8 md:mb-10 gap-4">
          <h2 className="text-[28px] sm:text-[32px] md:text-[40px] text-black font-extrabold leading-tight uppercase text-center md:text-left">
            Our Happy Customers
          </h2>

          {/* Carousel arrows beside the title */}
          <div className="hidden md:flex items-center gap-3">
            <CarouselArrowButton
              direction="prev"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
            />
            <CarouselArrowButton
              direction="next"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
            />
          </div>
        </div>

        <Carousel opts={{ align: "start" }} setApi={onApiSet} className="w-full">
          <CarouselContent className="-ml-4 md:-ml-6">
            {REVIEWS.map((review) => (
              <CarouselItem
                key={review.name}
                className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Review;
