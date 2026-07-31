import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BlogPostForm } from "@/components/panel/blog-post-form";
import { createBlogPostAction } from "@/lib/actions/blog";

export default async function NewBlogPostPage() {
  const t = await getTranslations("panelBlogAdmin");

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title={t("newPostTitle")} />
      <BlogPostForm action={createBlogPostAction} />
    </div>
  );
}
