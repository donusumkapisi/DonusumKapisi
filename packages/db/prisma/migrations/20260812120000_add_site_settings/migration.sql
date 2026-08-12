-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- Seed singleton row
INSERT INTO "site_settings" ("id", "maintenanceMode", "maintenanceMessage", "updatedAt")
VALUES ('default', false, NULL, CURRENT_TIMESTAMP);
