import { Container } from "../components/container";
import Footer from "../components/footer";
import { Header } from "../components/header";
import MarkdownReader from "../components/markdown-reader";
import { getSEOTags } from "../lib/seo";

export const metadata = getSEOTags({
  title: "Privacy Policy | Summary AI",
  description:
    "Read the privacy policy for Summary AI app. Learn how we protect your data and privacy.",
  canonicalUrlRelative: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container>
      <Header />
      <main className="mt-12">
        <MarkdownReader filename="privacy.md" />
      </main>
      <Footer />
    </Container>
  );
}
