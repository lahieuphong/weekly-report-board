import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export function MarkdownBlock({ content }: Props) {
  if (!content?.trim()) return null;

  return (
    <div className="space-y-3 text-[15px] leading-7 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {children}
            </h2>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="space-y-2 pl-5">{children}</ul>,
          li: ({ children }) => <li className="list-disc">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}