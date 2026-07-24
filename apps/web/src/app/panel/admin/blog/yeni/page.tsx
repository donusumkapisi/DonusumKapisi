import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { BlogPostForm } from "@/components/panel/blog-post-form";
import { createBlogPostAction } from "@/lib/actions/blog";

export default async function NewBlogPostPage() {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "ADMIN") redirect("/panel");

  const [t, tPanel] = await Promise.all([
    getTranslations("panelBlogAdmin"),
    getTranslations("panel"),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
        {tPanel("adminEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink">{t("newPostTitle")}</h1>

      <div className="mt-8">
        <BlogPostForm action={createBlogPostAction} />
      </div>
    </div>
  );
}
