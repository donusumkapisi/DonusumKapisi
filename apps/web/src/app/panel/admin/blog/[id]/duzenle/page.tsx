import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BlogPostForm } from "@/components/panel/blog-post-form";
import { updateBlogPostAction } from "@/lib/actions/blog";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const [post, t] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    getTranslations("panelBlogAdmin"),
  ]);
  if (!post) notFound();

  const boundAction = updateBlogPostAction.bind(null, post.id);

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title={t("editPostTitle")} />

      <div>
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
