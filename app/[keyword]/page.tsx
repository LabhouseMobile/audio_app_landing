import BeforeAfter from "@/app/components/before-after";
import { Container } from "@/app/components/container";
import FAQ from "@/app/components/faq";
import Footer from "@/app/components/footer";
import { Header } from "@/app/components/header";
import Hero from "@/app/components/hero";
import { getSEOTags } from "@/app/lib/seo";
import { redirect } from "next/navigation";
import { keywords } from "./keywords";

export const generateMetadata = ({
  params,
}: {
  params: { keyword: string };
}) => {
  return getSEOTags({
    title: `Summary AI for ${params.keyword}`,
    description: `Summary AI helps with ${params.keyword}.`,
    canonicalUrlRelative: `/${params.keyword}`,
  });
};

export async function generateStaticParams() {
  return keywords.map((keyword) => ({
    keyword: keyword.replace(/\s+/g, "-").toLowerCase(),
  }));
}
function isValidKeyword(keyword: string): boolean {
  return keywords
    .map((k) => k.replace(/\s+/g, "-").toLowerCase())
    .includes(keyword.toLowerCase());
}

export default function KeywordPage({
  params,
}: {
  params: { keyword: string };
}) {
  if (!isValidKeyword(params.keyword)) {
    return redirect("/");
  }
  //Use the decoded keyword when needed
  // const config = keywordConfigs[params.keyword] || {};

  return (
    <Container>
      <Header />
      <Hero />
      <BeforeAfter />
      <FAQ />
      <Footer />
    </Container>
  );
}
