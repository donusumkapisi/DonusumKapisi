import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { BlogPostForm } from "@/components/panel/blog-post-form";
import { updateBlogPostAction } from "@/lib/actions/blog";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "ADMIN") redirect("/panel");

  const { id } = await params;
  const [post, t, tPanel] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    getTranslations("panelBlogAdmin"),
    getTranslations("panel"),
  ]);
  if (!post) notFound();

  const boundAction = updateBlogPostAction.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
        {tPanel("adminEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink">{t("editPostTitle")}</h1>

      <div className="mt-8">
        <BlogPostForm
          action={boundAction}
          initialValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            body: post.body,
            coverImageUrl: post.coverImageUrl,
            category: post.category,
            tags: post.tags,
            metaDescription: post.metaDescription,
            province: post.province,
            district: post.district,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
