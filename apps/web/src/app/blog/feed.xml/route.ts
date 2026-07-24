import { getPublishedBlogPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedBlogPosts();
  const lastBuild = posts[0]?.updatedAt ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = [
        `<category>${escapeXml(post.category)}</category>`,
        ...post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
      ].join("\n    ");
      const enclosure = post.coverImageUrl
        ? `\n    <enclosure url="${escapeXml(post.coverImageUrl)}" type="image/jpeg" />`
        : "";

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(post.metaDescription ?? post.excerpt)}</description>
    <pubDate>${post.createdAt.toUTCString()}</pubDate>
    ${categories}${enclosure}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(`${SITE_NAME} — Kentsel Dönüşüm Rehberi`)}</title>
  <link>${SITE_URL}/blog</link>
  <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
  <description>${escapeXml(
    "Kentsel dönüşüm süreci, mevzuat, maliyet, müteahhit seçimi ve bölge rehberleri."
  )}</description>
  <language>tr-TR</language>
  <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
