import { prisma } from "@donusum-kapisi/db";

export async function getLatestPublishedAnnouncement() {
  return prisma.announcement.findFirst({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      imageUrl: true,
      linkUrl: true,
      createdAt: true,
    },
  });
}
