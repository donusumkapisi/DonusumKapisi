import { prisma } from "@donusum-kapisi/db";

const DEFAULT_ID = "default";

const DEFAULT_MESSAGE =
  "Sistemimizde kısa süreli bakım çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyin.";

export type SiteSettingsDTO = {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  updatedAt: Date;
};

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  const row = await prisma.siteSettings.upsert({
    where: { id: DEFAULT_ID },
    create: { id: DEFAULT_ID, maintenanceMode: false },
    update: {},
    select: {
      maintenanceMode: true,
      maintenanceMessage: true,
      updatedAt: true,
    },
  });

  return {
    maintenanceMode: row.maintenanceMode,
    maintenanceMessage: row.maintenanceMessage?.trim() || DEFAULT_MESSAGE,
    updatedAt: row.updatedAt,
  };
}

export async function updateSiteSettings(input: {
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
}) {
  const message = input.maintenanceMessage?.trim();
  return prisma.siteSettings.upsert({
    where: { id: DEFAULT_ID },
    create: {
      id: DEFAULT_ID,
      maintenanceMode: input.maintenanceMode,
      maintenanceMessage: message || null,
    },
    update: {
      maintenanceMode: input.maintenanceMode,
      ...(input.maintenanceMessage !== undefined
        ? { maintenanceMessage: message || null }
        : {}),
    },
  });
}
