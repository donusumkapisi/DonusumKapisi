"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { blogPostSchema } from "@donusum-kapisi/shared";
import { auth } from "@/lib/auth";
import { uploadBlogCoverImage } from "@/lib/storage/blog-cover";

export type BlogActionState = { error: string } | null;

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Yetkiniz yok.");
  }
  return session;
}

export async function createBlogPostAction(
  _prevState: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  const session = await requireAdmin();
  const t = await getTranslations("panel");

  const parsed = blogPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: t("errorSlugTaken") };
  }

  const coverImageFile = formData.get("coverImage");
  const coverImageUrl =
    coverImageFile instanceof File && coverImageFile.size > 0
      ? await uploadBlogCoverImage(coverImageFile, parsed.data.slug)
      : null;

  await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      category: parsed.data.category,
      tags: parsed.data.tags,
      metaDescription: parsed.data.metaDescription,
      province: parsed.data.province,
      district: parsed.data.district,
      published: parsed.data.published,
      coverImageUrl,
      authorId: session.user.id,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath(`/blog/kategori/${parsed.data.category}`);
  revalidatePath("/panel/admin/blog");
  redirect("/panel/admin/blog");
}

export async function updateBlogPostAction(
  postId: string,
  _prevState: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  await requireAdmin();
  const t = await getTranslations("panel");

  const parsed = blogPostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t("errorFormInvalid") };
  }

  const existing = await prisma.blogPost.findFirst({
    where: { slug: parsed.data.slug, NOT: { id: postId } },
  });
  if (existing) {
    return { error: t("errorSlugTaken") };
  }

  const coverImageFile = formData.get("coverImage");
  const newCoverImageUrl =
    coverImageFile instanceof File && coverImageFile.size > 0
      ? await uploadBlogCoverImage(coverImageFile, parsed.data.slug)
      : undefined;

  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      category: parsed.data.category,
      tags: parsed.data.tags,
      metaDescription: parsed.data.metaDescription ?? null,
      province: parsed.data.province ?? null,
      district: parsed.data.district ?? null,
      published: parsed.data.published,
      ...(newCoverImageUrl ? { coverImageUrl: newCoverImageUrl } : {}),
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath(`/blog/kategori/${parsed.data.category}`);
  revalidatePath("/panel/admin/blog");
  redirect("/panel/admin/blog");
}

export async function deleteBlogPostAction(postId: string) {
  await requireAdmin();
  const existing = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { slug: true, category: true },
  });
  await prisma.blogPost.delete({ where: { id: postId } });
  revalidatePath("/blog");
  if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
  if (existing?.category) revalidatePath(`/blog/kategori/${existing.category}`);
  revalidatePath("/panel/admin/blog");
}
