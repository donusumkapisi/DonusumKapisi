import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function MaintenancePage({ message }: { message: string }) {
  const t = await getTranslations("maintenance");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <Wrench className="size-7" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-muted">{message}</p>
      <Button asChild variant="outline" size="sm" className="mt-8">
        <Link href="/giris">{t("adminLogin")}</Link>
      </Button>
    </div>
  );
}
