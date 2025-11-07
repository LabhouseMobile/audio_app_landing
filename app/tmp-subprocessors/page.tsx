import type { Metadata } from "next";
import { Container } from "../components/container";
import Footer from "../components/footer";
import { Header } from "../components/header";
import SubprocessorsSection from "../components/tmp/subprocessors";

export const metadata: Metadata = {
  title: "Subprocessors | Summary AI",
  robots: {
    index: false,
    follow: false, // Optionally, set to false to prevent crawlers from following links on this page
    // You can also use a simple string:
    // robots: 'noindex, nofollow'
  },
};

export default function SubprocessorsPage() {
  return (
    <Container>
      <Header />
      <main className="mt-12">
        <SubprocessorsSection />
      </main>
      <Footer />
    </Container>
  );
}
