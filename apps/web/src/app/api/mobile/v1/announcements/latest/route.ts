import { NextResponse } from "next/server";
import { getLatestPublishedAnnouncement } from "@/lib/announcements";
import { SITE_URL } from "@/lib/site";

function toAbsoluteUrl(url: string | null) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function GET() {
  const announcement = await getLatestPublishedAnnouncement();
  if (!announcement) {
    return NextResponse.json({ announcement: null });
  }

  return NextResponse.json({
    announcement: {
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      imageUrl: toAbsoluteUrl(announcement.imageUrl),
      linkUrl: announcement.linkUrl,
      createdAt: announcement.createdAt.toISOString(),
    },
  });
}
