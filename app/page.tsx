import BeforeAfter from "./components/before-after";
import { Container } from "./components/container";
import FAQ from "./components/faq";
import Footer from "./components/footer";
import { Header } from "./components/header";
import HeaderBanner from "./components/header-banner";
import Hero from "./components/hero";
import Reviews from "./components/reviews";
import { renderSchemaTags } from "./lib/seo";

export default function Home() {
  return (
    <Container>
      <HeaderBanner />
      <Header />
      <Hero />
      <Reviews />
      <BeforeAfter />
      <FAQ />
      <Footer />
      {renderSchemaTags()}
    </Container>
  );
}
