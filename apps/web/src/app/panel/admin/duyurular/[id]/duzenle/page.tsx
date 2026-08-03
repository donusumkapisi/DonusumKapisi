import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@donusum-kapisi/db";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AnnouncementForm } from "@/components/panel/announcement-form";
import { updateAnnouncementAction } from "@/lib/actions/announcement";

type Props = { params: Promise<{ id: string }> };

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const [announcement, t] = await Promise.all([
    prisma.announcement.findUnique({ where: { id } }),
    getTranslations("panelAnnouncementAdmin"),
  ]);
  if (!announcement) notFound();

  const boundAction = updateAnnouncementAction.bind(null, announcement.id);

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title={t("editTitle")} />
      <AnnouncementForm
        action={boundAction}
        initialValues={{
          title: announcement.title,
          body: announcement.body,
          imageUrl: announcement.imageUrl,
          linkUrl: announcement.linkUrl,
          published: announcement.published,
        }}
      />
    </div>
  );
}
