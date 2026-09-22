import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";

const styles = [
  { title: "Casual", url: "/Frame 61.png", href: "/shop/casual" },
  { title: "Formal", url: "/Frame 62.png", href: "/shop/mens-clothes" },
  { title: "Party", url: "/Frame 64.png", href: "/shop/casual" },
  { title: "Gym", url: "/Frame 63.png", href: "/shop/mens-clothes" },
];

const DressStyle = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="container-shop bg-[#F0F0F0] px-6 pb-6 pt-10 md:p-[70px] rounded-[20px] md:rounded-[40px] text-center">
        <motion.h2
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[28px] leading-[32px] font-extrabold text-black md:text-5xl mb-8 md:mb-14 uppercase"
        >
          Browse By Dress Style
        </motion.h2>

        <motion.div
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-5 mb-5"
        >
          <StyleCard {...styles[0]} />
          <StyleCard {...styles[1]} />
        </motion.div>

        <motion.div
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid sm:grid-cols-2 gap-5"
        >
          <StyleCard {...styles[2]} />
          <StyleCard {...styles[3]} />
        </motion.div>
      </section>
    </div>
  );
};

// NOTE: the style images already include their label text (Casual, Formal...),
// so no overlay title is rendered here — only a subtle hover CTA.
function StyleCard({ title, url, href }: { title: string; url: string; href: string }) {
  return (
    <Link
      href={href}
      aria-label={`Shop ${title} style`}
      className="group relative block rounded-[20px] overflow-hidden bg-white h-[190px] md:h-[289px]"
    >
      <Image
        src={url}
        alt={title}
        width={629}
        height={289}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      <span className="absolute bottom-5 right-6 text-sm font-semibold text-black bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Shop now →
      </span>
    </Link>
  );
}

export default DressStyle;
