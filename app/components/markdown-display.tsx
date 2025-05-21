import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

interface MarkdownDisplayProps {
  filename: string;
}

export default async function MarkdownDisplay({
  filename,
}: MarkdownDisplayProps) {
  // Read the markdown file on the server
  const filePath = path.join(process.cwd(), "public", "markdown", filename);
  const content = fs.readFileSync(filePath, "utf8");

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg p-6 md:p-8">
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />
              ),
              p: ({ ...props }) => <p className="my-4" {...props} />,
              a: ({ ...props }) => (
                <a
                  className="text-blue-600 hover:text-blue-800 underline"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc pl-6 my-4" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal pl-6 my-4" {...props} />
              ),
              li: ({ ...props }) => <li className="mb-1" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic my-4"
                  {...props}
                />
              ),
              hr: ({ ...props }) => (
                <hr className="my-6 border-t border-gray-300" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-bold" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
