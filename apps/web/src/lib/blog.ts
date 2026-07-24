import { prisma } from "@donusum-kapisi/db";

const PAGE_SIZE = 10;

export async function getPublishedBlogPosts(category?: string) {
  return prisma.blogPost.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedBlogPostsPage(
  page: number,
  category?: string,
  tag?: string
) {
  const where = {
    published: true,
    ...(category ? { category } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
  };
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
  ]);
  return {
    posts,
    total,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getBlogCategoryCounts() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { category: true },
  });
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return counts;
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return null;
  return post;
}

export async function getRelatedBlogPosts(post: { id: string; category: string }, take = 3) {
  return prisma.blogPost.findMany({
    where: { published: true, category: post.category, NOT: { id: post.id } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

const WORDS_PER_MINUTE = 200;

export function getWordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function getReadingMinutes(body: string): number {
  return Math.max(1, Math.round(getWordCount(body) / WORDS_PER_MINUTE));
}
