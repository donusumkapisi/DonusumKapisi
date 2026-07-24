import { NextResponse } from "next/server";
import { getPublishedBlogPostBySlug } from "@/lib/blog";
import { toBlogPostDTO } from "@/lib/dto";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ post: toBlogPostDTO(post) });
}
