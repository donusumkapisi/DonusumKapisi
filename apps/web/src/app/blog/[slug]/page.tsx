import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBlogCategoryLabel } from "@donusum-kapisi/shared";
import Image from "next/image";
import {
  getPublishedBlogPostBySlug,
  getReadingMinutes,
  getRelatedBlogPosts,
  getWordCount,
} from "@/lib/blog";
import {
  extractBlogFaqs,
  faqPageJsonLd,
  organizationJsonLd,
} from "@/lib/blog-seo";
import { BlogContent } from "@/components/marketing/blog-content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, t] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getTranslations("blog"),
  ]);
  if (!post) return { title: t("notFoundTitle") };

  const description = post.metaDescription ?? post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.coverImageUrl
    ? [{ url: post.coverImageUrl, alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description,
    keywords: post.tags.length > 0 ? post.tags : undefined,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    category: getBlogCategoryLabel(post.category),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      siteName: SITE_NAME,
      title: post.title,
      description,
      url,
      images,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [SITE_NAME],
      tags: post.tags.length > 0 ? post.tags : undefined,
      section: getBlogCategoryLabel(post.category),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, t] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getTranslations("blog"),
  ]);
  if (!post) notFound();

  const relatedPosts = await getRelatedBlogPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const categoryPath = `/blog/kategori/${post.category}`;
  const categoryUrl = `${SITE_URL}${categoryPath}`;
  const categoryLabel = getBlogCategoryLabel(post.category);
  const location = [post.district, post.province].filter(Boolean).join(", ");
  const readingMinutes = getReadingMinutes(post.body);
  const faqs = extractBlogFaqs(post.body);
  const faqJsonLd = faqPageJsonLd(faqs);
  const org = organizationJsonLd();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "tr-TR",
    wordCount: getWordCount(post.body),
    timeRequired: `PT${readingMinutes}M`,
    articleSection: categoryLabel,
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    author: org,
    publisher: org,
    isPartOf: {
      "@type": "Blog",
      name: t("pageTitle"),
      url: `${SITE_URL}/blog`,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: categoryUrl },
      { "@type": "ListItem", position: 4, name: post.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-clay">
          {t("breadcrumbHome")}
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-clay">
          {t("pageTitle")}
        </Link>
        <span>/</span>
        <Link href={categoryPath} className="hover:text-clay">
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-ink">{post.title}</span>
      </nav>

      <header>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 font-mono text-xs tracking-[0.2em] text-clay uppercase">
          <Link href={categoryPath} className="hover:underline">
            {categoryLabel}
          </Link>
          {location ? (
            <span>
              · {t("locationLabel")}: {location}
            </span>
          ) : null}
          <span className="text-ink-muted normal-case tracking-normal">
            · {t("readingTime", { minutes: readingMinutes })}
          </span>
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-ink-muted">{post.excerpt}</p>
        <p className="mt-3 font-mono text-[0.65rem] tracking-wide text-ink-muted/70">
          <time dateTime={post.createdAt.toISOString()}>
            {post.createdAt.toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.updatedAt.getTime() - post.createdAt.getTime() > 86_400_000 ? (
            <>
              {" · "}
              {t("updatedLabel")}{" "}
              <time dateTime={post.updatedAt.toISOString()}>
                {post.updatedAt.toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          ) : null}
        </p>
      </header>

      {post.coverImageUrl && (
        <div className="relative mt-8 h-64 overflow-hidden rounded-2xl border border-hairline sm:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote blob URLs already allowlisted via next/image; keep Image */}
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 640px) 672px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8 text-sm text-ink-muted">
        <BlogContent body={post.body} tocLabel={t("tocLabel")} />
      </div>

      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-hairline pt-6">
          <span className="text-xs text-ink-muted">{t("tagsLabel")}:</span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?etiket=${encodeURIComponent(tag)}`}
              className="rounded-full bg-surface px-3 py-1 text-xs text-ink-muted transition-colors hover:bg-clay/10 hover:text-clay"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <aside className="mt-10 rounded-2xl border border-hairline bg-surface/60 px-5 py-5">
        <p className="font-display text-base text-ink">{t("ctaTitle")}</p>
        <p className="mt-1.5 text-sm text-ink-muted">{t("ctaBody")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/ilan-ver"
            className="rounded-xl bg-clay px-4 py-2 text-sm font-medium text-white hover:bg-clay-soft"
          >
            {t("ctaPostListing")}
          </Link>
          <Link
            href="/sss"
            className="rounded-xl border border-hairline px-4 py-2 text-sm font-medium text-ink hover:border-clay/40"
          >
            {t("ctaFaq")}
          </Link>
        </div>
      </aside>

      {relatedPosts.length > 0 && (
        <div className="mt-12 border-t border-hairline pt-8">
          <h2 className="font-display text-lg text-ink">{t("relatedTitle")}</h2>
          <div className="mt-5 space-y-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="block rounded-xl border border-hairline bg-surface p-3.5 transition-colors hover:border-clay/40"
              >
                <p className="font-display text-base text-ink">{related.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
