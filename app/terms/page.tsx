import { Container } from "../components/container";
import Footer from "../components/footer";
import { Header } from "../components/header";
import TermsOfServiceSection from "../components/terms-of-service";
import { getSEOTags } from "../lib/seo";

export const metadata = getSEOTags({
  title: "Terms of Service | Summary AI",
  description:
    "Read the terms of service for Summary AI app. Learn about the terms and conditions of using our service.",
  canonicalUrlRelative: "/terms",
});

export default function TermsPage() {
  return (
    <Container>
      <Header />
      <main className="mt-12">
        <TermsOfServiceSection />
      </main>
      <Footer />
    </Container>
  );
}
