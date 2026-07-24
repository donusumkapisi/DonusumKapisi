import { slugify } from "@donusum-kapisi/shared";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export type BlogBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string };

export type BlogFaqItem = { question: string; answer: string };

function uniqueIdFactory() {
  const usedIds = new Set<string>();
  return (text: string) => {
    const base = slugify(text) || "bolum";
    let id = base;
    let i = 2;
    while (usedIds.has(id)) {
      id = `${base}-${i}`;
      i += 1;
    }
    usedIds.add(id);
    return id;
  };
}

/** Markdown-lite body → blocks (shared by renderer + FAQ extraction). */
export function parseBlogBlocks(body: string): BlogBlock[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: BlogBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  const uniqueId = uniqueIdFactory();

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "p", text: paragraphBuffer.join(" ") });
      paragraphBuffer = [];
    }
  };
  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "ul", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      const text = line.slice(4).trim();
      blocks.push({ type: "h3", text, id: uniqueId(text) });
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      const text = line.slice(3).trim();
      blocks.push({ type: "h2", text, id: uniqueId(text) });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2).trim());
    } else if (line === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraphBuffer.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

/**
 * Extract FAQ pairs from in-article Q&A sections.
 * Looks for h2 containing "sık sorulan" / "sss" / "faq", then h3 + following paragraphs.
 * Falls back to any h3 ending with "?" followed by a paragraph.
 */
export function extractBlogFaqs(body: string): BlogFaqItem[] {
  const blocks = parseBlogBlocks(body);
  const faqs: BlogFaqItem[] = [];
  let inFaqSection = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "h2") {
      const lower = block.text.toLocaleLowerCase("tr-TR");
      inFaqSection =
        lower.includes("sık sorulan") ||
        lower.includes("sss") ||
        lower.includes("faq") ||
        lower.includes("frequently asked");
      continue;
    }
    if (block.type !== "h3") continue;

    const looksLikeQuestion = block.text.includes("?") || inFaqSection;
    if (!looksLikeQuestion) continue;

    const answerParts: string[] = [];
    for (let j = i + 1; j < blocks.length; j++) {
      const next = blocks[j];
      if (next.type === "h2" || next.type === "h3") break;
      if (next.type === "p") answerParts.push(next.text);
      if (next.type === "ul") answerParts.push(next.items.map((item) => `• ${item}`).join(" "));
    }
    const answer = answerParts.join(" ").trim();
    if (answer.length >= 20) {
      faqs.push({ question: block.text.replace(/\?+$/, "?"), answer });
    }
  }

  return faqs.slice(0, 12);
}

export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

export const SITE_LOGO_URL = `${SITE_URL}/globe.svg`;

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
    },
  };
}

export function faqPageJsonLd(faqs: BlogFaqItem[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: stripInlineMarkdown(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripInlineMarkdown(faq.answer),
      },
    })),
  };
}
