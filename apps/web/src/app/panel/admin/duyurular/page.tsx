import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DeleteAnnouncementButton } from "@/components/panel/delete-announcement-button";

export default async function AdminAnnouncementsPage() {
  const [announcements, t] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
    getTranslations("panelAnnouncementAdmin"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("listTitle")}
        description={t("listDescription")}
        action={
          <Button asChild variant="cta" size="sm">
            <Link href="/panel/admin/duyurular/yeni">{t("newButton")}</Link>
          </Button>
        }
      />

      {announcements.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("emptyState")}</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.imageUrl ? (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-hairline">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-surface text-[0.65rem] text-ink-muted">
                    {t("noImage")}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display text-base text-ink">{item.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{item.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.published
                      ? "bg-clay/10 text-clay"
                      : "bg-surface text-ink-muted"
                  }`}
                >
                  {item.published ? t("statusLive") : t("statusDraft")}
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/panel/admin/duyurular/${item.id}/duzenle`}>
                    {t("editButton")}
                  </Link>
                </Button>
                <DeleteAnnouncementButton announcementId={item.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
