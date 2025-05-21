import CaliforniaPrivacySection from "../components/california-privacy";
import { Container } from "../components/container";
import Footer from "../components/footer";
import { Header } from "../components/header";
import { getSEOTags } from "../lib/seo";

export const metadata = getSEOTags({
  title: "California Privacy Notice | Summary AI",
  description:
    "Read the California Privacy Notice for Summary AI app. Learn about your privacy rights under California law.",
  canonicalUrlRelative: "/california-privacy",
});

export default function CaliforniaPrivacyPage() {
  return (
    <Container>
      <Header />
      <main className="mt-12">
        <CaliforniaPrivacySection />
      </main>
      <Footer />
    </Container>
  );
}
