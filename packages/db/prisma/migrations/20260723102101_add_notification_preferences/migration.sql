-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notifyAppointments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyListingStatus" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOffers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySavedSearch" BOOLEAN NOT NULL DEFAULT true;
