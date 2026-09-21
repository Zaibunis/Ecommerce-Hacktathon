import Image from "next/image";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font bg-[#F0F0F0]">
      <div className="container border-b border-black/10 px-5 py-12 mx-auto flex md:items-start md:flex-row md:flex-nowrap flex-wrap flex-col gap-10">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <span className="text-3xl text-black font-extrabold mb-2 block">SHOP.CO</span>
          <p className="mt-2 text-sm text-black/60 mb-6">
            We have clothes that suits your style and which you&apos;re proud to wear. From women to men.
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            <a href="#" aria-label="Twitter" className="w-7 h-7 flex items-center justify-center bg-white rounded-full hover:bg-black hover:text-white transition-colors text-black">
              <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="w-7 h-7 flex items-center justify-center bg-white rounded-full hover:bg-black hover:text-white transition-colors text-black">
              <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-7 h-7 flex items-center justify-center bg-white rounded-full hover:bg-black hover:text-white transition-colors text-black">
              <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="w-7 h-7 flex items-center justify-center bg-white rounded-full hover:bg-black hover:text-white transition-colors text-black">
              <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 007.88 10.92c.58.1.79-.25.79-.56v-2.01c-3.21.7-3.89-1.55-3.89-1.55-.53-1.36-1.3-1.73-1.3-1.73-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.73 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.14 11.14 0 015.78 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.2 1.82 1.2 3.08 0 4.46-2.7 5.44-5.27 5.72.42.37.78 1.1.78 2.22v3.3c0 .31.2.67.79.56A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex-grow flex flex-wrap md:pl-16 md:text-left text-center">
          {[
            { title: "Company", links: ["About", "Features", "Works", "Career"] },
            { title: "Help", links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"] },
            { title: "FAQ", links: ["Account", "Manage Deliveries", "Orders", "Payments"] },
            { title: "Resources", links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"] },
          ].map((col) => (
            <div key={col.title} className="lg:w-1/4 md:w-1/2 w-full px-4 mb-8">
              <h2 className="font-medium text-black tracking-widest text-base mb-4">{col.title}</h2>
              <nav className="list-none">
                {col.links.map((link) => (
                  <li key={link} className="text-black/60 hover:text-black mb-3 cursor-pointer text-sm">
                    {link}
                  </li>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-5 px-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-black/60 text-sm text-center sm:text-left">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex space-x-3">
          <Image src="/Badge.png" width={46} height={30} alt="Visa" />
          <Image src="/Badge (1).png" width={46} height={30} alt="Mastercard" />
          <Image src="/Badge (2).png" width={46} height={30} alt="Alipay" />
          <Image src="/Badge (3).png" width={46} height={30} alt="Apple Pay" />
          <Image src="/Badge (4).png" width={46} height={30} alt="Discover" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
