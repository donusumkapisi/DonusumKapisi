import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BLOG_CATEGORIES, getBlogCategoryLabel } from "@donusum-kapisi/shared";
import {
  getBlogCategoryCounts,
  getPublishedBlogPostsPage,
  getReadingMinutes,
} from "@/lib/blog";
import { BlogPostCard } from "@/components/marketing/blog-post-card";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = {
  searchParams: Promise<{ sayfa?: string; etiket?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { sayfa, etiket } = await searchParams;
  const page = Math.max(1, Number(sayfa) || 1);
  const t = await getTranslations("blog");

  const baseTitle = t("metaTitle");
  const title =
    page > 1
      ? t("metaTitlePaged", { title: baseTitle, page })
      : etiket
        ? t("metaTitleTagged", { title: baseTitle, tag: etiket })
        : baseTitle;

  const description = etiket
    ? t("metaDescriptionTagged", { tag: etiket })
    : t("pageSubtitle");

  const canonical =
    page > 1
      ? `${SITE_URL}/blog?sayfa=${page}`
      : etiket
        ? `${SITE_URL}/blog?etiket=${encodeURIComponent(etiket)}`
        : `${SITE_URL}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical,
      types: { "application/rss+xml": `${SITE_URL}/blog/feed.xml` },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { sayfa, etiket } = await searchParams;
  const page = Math.max(1, Number(sayfa) || 1);
  const tag = etiket?.trim() || undefined;

  const [{ posts, total, pageCount }, categoryCounts, t] = await Promise.all([
    getPublishedBlogPostsPage(page, undefined, tag),
    getBlogCategoryCounts(),
    getTranslations("blog"),
  ]);

  const allCount = [...categoryCounts.values()].reduce((sum, n) => sum + n, 0);
  const collectionUrl =
    page > 1 ? `${SITE_URL}/blog?sayfa=${page}` : `${SITE_URL}/blog`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("pageTitle"),
    description: t("pageSubtitle"),
    url: collectionUrl,
    isPartOf: { "@type": "Blog", name: t("pageTitle"), url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: (page - 1) * 10 + i + 1,
        name: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          url: `${SITE_URL}/blog/${post.slug}`,
          datePublished: post.createdAt.toISOString(),
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        {t("pageTitle")}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
        {t("pageSubtitle")}
      </p>

      {tag ? (
        <p className="mt-4 text-sm text-ink-muted">
          {t("filteringByTag", { tag })}{" "}
          <Link href="/blog" className="text-clay hover:underline">
            {t("clearFilter")}
          </Link>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            !tag
              ? "border-clay bg-clay/10 text-clay"
              : "border-hairline text-ink-muted hover:border-clay/40"
          }`}
        >
          {t("allCategoriesLabel")} ({allCount})
        </Link>
        {BLOG_CATEGORIES.filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0).map((c) => (
          <Link
            key={c.slug}
            href={`/blog/kategori/${c.slug}`}
            className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-clay/40"
          >
            {getBlogCategoryLabel(c.slug)} ({categoryCounts.get(c.slug)})
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-sm text-ink-muted">{t("emptyState")}</p>
      ) : (
        <div className="mt-10 space-y-8">
          {posts.map((post) => (
            <BlogPostCard
              key={post.id}
              post={post}
              readingLabel={t("readingTime", { minutes: getReadingMinutes(post.body) })}
              readMoreLabel={t("readMore")}
            />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav
          className="mt-12 flex items-center justify-center gap-2"
          aria-label={t("paginationLabel")}
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/blog" : `/blog?sayfa=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`flex size-8 items-center justify-center rounded-full text-xs font-medium ${
                p === page
                  ? "bg-clay text-white"
                  : "border border-hairline text-ink-muted hover:border-clay/40"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
