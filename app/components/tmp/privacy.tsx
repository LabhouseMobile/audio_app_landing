import MarkdownReader from "../markdown-reader";

export default async function PrivacySection() {
  return <MarkdownReader filename="tmp/privacy.md" />;
}
