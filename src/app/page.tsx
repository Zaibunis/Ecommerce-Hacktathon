import Home from "./component/home"
import Hero from "./component/hero"
import Brands from "./component/brand"
import DressStyle from "./component/dressStyle"
import Review from "./component/review"
import Footer from "./component/Footer"
import Newsletter from "./component/Newsletter"
import Main from "./productOne/page"
import Main2 from "./productTwo/page"
import Chatbot from "./component/Chatbot"

export default function Land() {
  return (
    <div>
      <Home />
      <Hero />
      <Brands />
      <Main />
      <Main2 />
      <DressStyle />
      <Review />
      <Chatbot />
      <Newsletter />
      <Footer />
    </div>
  );
}
