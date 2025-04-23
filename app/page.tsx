import BeforeAfter from "./components/before-after";
import { Container } from "./components/container";
import FAQ from "./components/faq";
import Footer from "./components/footer";
import { Header } from "./components/header";
import HeaderBanner from "./components/header-banner";
import Hero from "./components/hero";
import Reviews from "./components/reviews";
import VideoQuote from "./components/video-quote";
import { renderSchemaTags } from "./lib/seo";

export default function Home({ 
  searchParams = {} 
}: { 
  searchParams?: { type?: string } 
}) {
  const params = searchParams || {};
  const qrType = params.type || "app";
  
  console.log("Type value:", qrType);

  return (
    <Container>
      <HeaderBanner />
      <Header />
      <Hero qrType={qrType} />
      <Reviews />
      <BeforeAfter />
      <VideoQuote />
      <FAQ />
      <Footer />
      {renderSchemaTags()}
    </Container>
  );
}
