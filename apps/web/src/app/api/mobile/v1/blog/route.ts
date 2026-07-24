import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blog";
import { toBlogPostDTO } from "@/lib/dto";

export async function GET() {
  const posts = await getPublishedBlogPosts();
  return NextResponse.json({ posts: posts.map(toBlogPostDTO) });
}
