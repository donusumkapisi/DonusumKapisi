-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
