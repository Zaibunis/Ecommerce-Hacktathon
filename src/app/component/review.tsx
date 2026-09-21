import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Review = () => {
  return (
    <div>
      <section className="flex flex-col text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-10">
            {/* Title Section */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-[28px] sm:text-[32px] md:text-[40px] text-black font-extrabold leading-[36px] md:text-5xl capitalize">
                OUR HAPPY CUSTOMERS
              </h1>
            </div>

            {/* Carousel Section */}
            <div className="text-black bg-white md:ml-8">
              <Carousel className="text-black">
                <CarouselContent>
                  <CarouselItem></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Reviews displayed in a single row */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 md:gap-6 overflow-x-auto">
            {/* Review Item 1 */}
            <div className="p-4 sm:w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg shadow-sm">
              <div className="flex rounded-lg h-full bg-white p-8 flex-col">
                <div className="mb-3">
                  <div className="flex space-x-1 justify-start">
                    {/* Rating Stars */}
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <h2 className="flex text-black text-lg title-font font-bold">
                    Sarah M.
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white bg-green-500 rounded-lg ml-[10px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </h2>
                </div>
                <div className="flex-grow mt-2">
                  <p className="leading-relaxed text-base">
                    &ldquo;I&apos;m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I&apos;ve bought has exceeded my expectations.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Review Item 2 */}
            <div className="p-4 sm:w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg shadow-sm">
              <div className="flex rounded-lg h-full bg-white p-8 flex-col">
                <div className="mb-3">
                  <div className="flex space-x-1 justify-start">
                    {/* Rating Stars */}
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <h2 className="flex text-black text-lg title-font font-bold">
                    Alex K.
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white bg-green-500 rounded-lg ml-[10px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </h2>
                </div>
                <div className="flex-grow mt-2">
                  <p className="leading-relaxed text-base">
                    &ldquo;Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Review Item 3 */}
            <div className="p-4 sm:w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg shadow-sm">
              <div className="flex rounded-lg h-full bg-white p-8 flex-col">
                <div className="mb-3">
                  <div className="flex space-x-1 justify-start">
                    {/* Rating Stars */}
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <h2 className="flex text-black text-lg title-font font-bold">
                    James L.
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white bg-green-500 rounded-lg ml-[10px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </h2>
                </div>
                <div className="flex-grow mt-2">
                  <p className="leading-relaxed text-base">
                    &ldquo;I love how diverse the collection is on Shop.co. There is something for everyone, and I always find the latest trends! Highly recommended for fashion lovers!&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Review;
