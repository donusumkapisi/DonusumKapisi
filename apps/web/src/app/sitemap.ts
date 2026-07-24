import type { MetadataRoute } from "next";
import { prisma } from "@donusum-kapisi/db";
import { BLOG_CATEGORIES } from "@donusum-kapisi/shared";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, listings, categoryUpdated] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, coverImageUrl: true, category: true },
    }),
    prisma.listing.findMany({
      where: { status: "APPROVED" },
      select: { listingNumber: true, updatedAt: true },
    }),
    prisma.blogPost.groupBy({
      by: ["category"],
      where: { published: true },
      _max: { updatedAt: true },
    }),
  ]);

  const categoryLastModified = new Map(
    categoryUpdated.map((row) => [row.category, row._max.updatedAt ?? undefined])
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ilanlar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/muteahhitler`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/ev-sahipleri`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/yatirimcilar`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ilan-ver`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/sss`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/blog/kategori/${c.slug}`,
    lastModified: categoryLastModified.get(c.slug),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
    images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${SITE_URL}/ilanlar/${listing.listingNumber}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...listingRoutes];
}
