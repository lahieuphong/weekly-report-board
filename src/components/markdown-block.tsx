import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export function MarkdownBlock({ content }: Props) {
  if (!content?.trim()) return null;

  return (
    <div className="space-y-1 text-[13px] leading-5 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-2 text-[13px] font-semibold leading-5 text-slate-900">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="text-[13px] leading-5">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-0 pl-5 text-[13px] leading-5">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="list-disc text-[13px] leading-5">{children}</li>
          ),
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