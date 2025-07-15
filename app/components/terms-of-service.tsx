import MarkdownReader from "./markdown-reader";

export default async function TermsOfServiceSection() {
  return <MarkdownReader filename="tos.md" />;
}
