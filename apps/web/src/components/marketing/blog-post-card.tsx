import Image from "next/image";
import Link from "next/link";
import { getBlogCategoryLabel } from "@donusum-kapisi/shared";

type BlogPostCardProps = {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    district: string | null;
    coverImageUrl: string | null;
    createdAt?: Date;
  };
  readingLabel?: string;
  readMoreLabel?: string;
};

export function BlogPostCard({ post, readingLabel, readMoreLabel }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-hairline bg-surface p-4 transition-colors hover:border-clay/40"
    >
      {post.coverImageUrl ? (
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.65rem] tracking-wider text-clay uppercase">
          {getBlogCategoryLabel(post.category)}
          {post.district ? ` · ${post.district}` : ""}
          {readingLabel ? (
            <span className="text-ink-muted normal-case tracking-normal"> · {readingLabel}</span>
          ) : null}
        </p>
        <h2 className="mt-1 font-display text-lg text-ink group-hover:text-clay">{post.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{post.excerpt}</p>
        {readMoreLabel ? (
          <p className="mt-2 text-xs font-medium text-clay">{readMoreLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}
