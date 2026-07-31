-- CreateEnum
CREATE TYPE "ContractorDocumentType" AS ENUM ('VERGI_LEVHASI', 'TICARET_SICIL_GAZETESI', 'TICARET_ODASI_KAYDI', 'IMZA_SIRKULERI', 'FAALIYET_BELGESI');

-- CreateEnum
CREATE TYPE "ContractorDocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContractorVerificationStatus" AS ENUM ('INCOMPLETE', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "contractor_profiles" DROP COLUMN "documentUrls",
ADD COLUMN     "mybn" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "verificationNote" TEXT,
ADD COLUMN     "verificationStatus" "ContractorVerificationStatus" NOT NULL DEFAULT 'INCOMPLETE';

-- Keep already-verified contractors verified. Their old documents were an
-- untyped URL list, so they are not carried over into contractor_documents.
UPDATE "contractor_profiles"
SET "verificationStatus" = 'APPROVED', "reviewedAt" = "updatedAt"
WHERE "verified" = true;

-- CreateTable
CREATE TABLE "contractor_documents" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "type" "ContractorDocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" "ContractorDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractor_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contractor_documents_profileId_type_key" ON "contractor_documents"("profileId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "contractor_profiles_mybn_key" ON "contractor_profiles"("mybn");

-- AddForeignKey
ALTER TABLE "contractor_documents" ADD CONSTRAINT "contractor_documents_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "contractor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
