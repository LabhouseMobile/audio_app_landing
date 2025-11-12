import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // <-- 1. Import the plugin
import remarkGfm from "remark-gfm";

interface MarkdownDisplayProps {
  content: string;
  containerClassName?: string;
}

export default function MarkdownDisplay({
  content,
  containerClassName = "max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8",
}: MarkdownDisplayProps) {
  return (
    <div className={containerClassName}>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1
                className="text-3xl font-bold mt-28 mb-8 text-center"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="text-2xl font-bold mt-24 mb-3 text-center"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-xl font-semibold mt-8 mb-2" {...props} />
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
            // Table components
            table: ({ ...props }) => (
              <div className="overflow-x-auto my-8">
                <table
                  className="min-w-full divide-y divide-gray-300 border"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            tbody: ({ ...props }) => (
              <tbody className="divide-y divide-gray-200" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="hover:bg-gray-50" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td className="px-4 py-3 text-sm text-gray-900" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
