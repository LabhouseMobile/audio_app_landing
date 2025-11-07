import fs from "fs";
import path from "path";
import MarkdownDisplay from "./markdown-display";

interface MarkdownReaderProps {
  filename: string;
}

export default async function MarkdownReader({
  filename,
}: MarkdownReaderProps) {
  // Read the markdown file on the server
  const filePath = path.join(process.cwd(), "content", "markdown", filename);
  const content = fs.readFileSync(filePath, "utf8");

  return <MarkdownDisplay content={content} />;
}
