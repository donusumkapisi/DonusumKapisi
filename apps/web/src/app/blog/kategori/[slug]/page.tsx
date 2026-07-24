import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  BLOG_CATEGORIES,
  getBlogCategoryDescription,
  getBlogCategoryLabel,
} from "@donusum-kapisi/shared";
import { getPublishedBlogPostsPage, getReadingMinutes } from "@/lib/blog";
import { BlogPostCard } from "@/components/marketing/blog-post-card";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sayfa?: string }>;
};

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, { sayfa }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("blog"),
  ]);
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  const page = Math.max(1, Number(sayfa) || 1);
  const label = getBlogCategoryLabel(category.slug);
  const description = getBlogCategoryDescription(category.slug);
  const baseTitle = t("categoryMetaTitle", { category: label });
  const title = page > 1 ? t("metaTitlePaged", { title: baseTitle, page }) : baseTitle;
  const url =
    page > 1
      ? `${SITE_URL}/blog/kategori/${category.slug}?sayfa=${page}`
      : `${SITE_URL}/blog/kategori/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sayfa } = await searchParams;
  const page = Math.max(1, Number(sayfa) || 1);
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const [result, t] = await Promise.all([
    getPublishedBlogPostsPage(page, category.slug),
    getTranslations("blog"),
  ]);
  const { posts, total, pageCount } = result;

  const label = getBlogCategoryLabel(category.slug);
  const description = getBlogCategoryDescription(category.slug);
  const url = `${SITE_URL}/blog/kategori/${category.slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("categoryMetaTitle", { category: label }),
    description,
    url,
    isPartOf: { "@type": "Blog", name: t("pageTitle"), url: `${SITE_URL}/blog` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: (page - 1) * 10 + i + 1,
        name: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: label, item: url },
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

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-clay">
          {t("breadcrumbHome")}
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-clay">
          {t("pageTitle")}
        </Link>
        <span>/</span>
        <span className="text-ink">{label}</span>
      </nav>

      <p className="mt-4 font-mono text-xs tracking-[0.2em] text-clay uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{label}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{description}</p>

      <div className="mt-6">
        <Link href="/blog" className="text-xs text-clay hover:underline">
          ← {t("allCategoriesLabel")}
        </Link>
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
              href={
                p === 1
                  ? `/blog/kategori/${category.slug}`
                  : `/blog/kategori/${category.slug}?sayfa=${p}`
              }
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
