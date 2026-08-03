import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AnnouncementForm } from "@/components/panel/announcement-form";
import { createAnnouncementAction } from "@/lib/actions/announcement";

export default async function NewAnnouncementPage() {
  const t = await getTranslations("panelAnnouncementAdmin");

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title={t("newTitle")} description={t("newDescription")} />
      <AnnouncementForm action={createAnnouncementAction} />
    </div>
  );
}
