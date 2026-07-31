import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { getBlogCategoryLabel } from "@donusum-kapisi/shared";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DeleteBlogPostButton } from "@/components/panel/delete-blog-post-button";

export default async function AdminBlogListPage() {
  const [posts, t] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
    getTranslations("panelBlogAdmin"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("listTitle")}
        action={
          <Button asChild variant="cta" size="sm">
            <Link href="/panel/admin/blog/yeni">{t("newPostButton")}</Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("emptyState")}</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper p-4"
            >
              <div className="min-w-0">
                <p className="font-display text-base text-ink">{post.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  /blog/{post.slug} · {getBlogCategoryLabel(post.category)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    post.published
                      ? "bg-clay/10 text-clay"
                      : "bg-surface text-ink-muted"
                  }`}
                >
                  {post.published ? t("statusLive") : t("statusDraft")}
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/panel/admin/blog/${post.id}/duzenle`}>{t("editButton")}</Link>
                </Button>
                <DeleteBlogPostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
