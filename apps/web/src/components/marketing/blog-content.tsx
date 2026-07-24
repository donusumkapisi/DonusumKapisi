import type { ReactNode } from "react";
import Link from "next/link";
import { parseBlogBlocks } from "@/lib/blog-seo";

const INLINE_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, linkText, href, boldText] = match;
    if (href) {
      const isInternal = href.startsWith("/");
      nodes.push(
        isInternal ? (
          <Link
            key={`${keyPrefix}-${i}`}
            href={href}
            className="text-clay underline underline-offset-2 hover:no-underline"
          >
            {linkText}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-clay underline underline-offset-2 hover:no-underline"
          >
            {linkText}
          </a>
        )
      );
    } else if (boldText) {
      nodes.push(
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
          {boldText}
        </strong>
      );
    }
    lastIndex = match.index + match[0].length;
    i += 1;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function BlogContent({ body, tocLabel }: { body: string; tocLabel?: string }) {
  const blocks = parseBlogBlocks(body);
  const headings = blocks.filter((b): b is Extract<(typeof blocks)[number], { type: "h2" }> => b.type === "h2");

  return (
    <div className="prose-blog">
      {headings.length >= 3 && (
        <nav
          aria-label={tocLabel ?? "İçindekiler"}
          className="mb-8 rounded-xl border border-hairline bg-surface p-4"
        >
          <p className="font-mono text-[0.65rem] tracking-wider text-clay uppercase">
            {tocLabel ?? "İçindekiler"}
          </p>
          <ol className="mt-2.5 space-y-1.5">
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="text-sm text-ink-muted hover:text-clay">
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              id={block.id}
              className="mt-10 scroll-mt-24 font-display text-2xl text-ink first:mt-0"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              id={block.id}
              className="mt-7 scroll-mt-24 font-display text-lg text-ink"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="mt-4 list-disc space-y-1.5 pl-5 marker:text-clay">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-4 leading-relaxed">
            {renderInline(block.text, `${i}`)}
          </p>
        );
      })}
    </div>
  );
}
