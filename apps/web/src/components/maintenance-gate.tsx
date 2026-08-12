import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";
import { MaintenancePage } from "@/components/maintenance-page";

const ALLOWED_PREFIXES = ["/giris", "/kayit", "/sifremi-unuttum", "/sifre-sifirla"];

function isAllowedPath(pathname: string) {
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function MaintenanceGate({ children }: { children: React.ReactNode }) {
  try {
    const settings = await getSiteSettings();
    if (!settings.maintenanceMode) return children;

    const session = await auth();
    if (session?.user?.role === "ADMIN") return children;

    const headerStore = await headers();
    const pathname = headerStore.get("x-pathname") ?? "/";
    if (isAllowedPath(pathname)) return children;

    return <MaintenancePage message={settings.maintenanceMessage} />;
  } catch {
    return children;
  }
}
