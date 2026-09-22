import Home from "./component/home"
import Hero from "./component/hero"
import Brands from "./component/brand"
import DressStyle from "./component/dressStyle"
import Review from "./component/review"
import Footer from "./component/Footer"
import Newsletter from "./component/Newsletter"
import ProductSection from "@/components/shop/ProductSection"
import Chatbot from "./component/Chatbot"

export default function Land() {
  return (
    <div>
      <Home />
      <Hero />
      <Brands />
      <ProductSection kind="new-arrivals" />
      <ProductSection kind="top-selling" />
      <DressStyle />
      <Review />
      <Chatbot />
      <Newsletter />
      <Footer />
    </div>
  );
}
