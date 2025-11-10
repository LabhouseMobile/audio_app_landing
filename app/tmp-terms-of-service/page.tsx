import type { Metadata } from "next";
import { Container } from "../components/container";
import Footer from "../components/footer";
import { Header } from "../components/header";
import MarkdownReader from "../components/markdown-reader";

export const metadata: Metadata = {
  title: "Terms of Service | Summary AI",
  robots: {
    index: false,
    follow: false, // Optionally, set to false to prevent crawlers from following links on this page
    // You can also use a simple string:
    // robots: 'noindex, nofollow'
  },
};

export default function TermsOfServicePage() {
  return (
    <Container>
      <Header />
      <main className="mt-12">
        <MarkdownReader filename="tmp/tos.md" />
      </main>
      <Footer />
    </Container>
  );
}
