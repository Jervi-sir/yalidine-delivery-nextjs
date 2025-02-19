-- AlterTable
ALTER TABLE "parcels" ADD COLUMN     "taxe_from" INTEGER,
ADD COLUMN     "taxe_percentage" DECIMAL(65,30),
ADD COLUMN     "taxe_retour" INTEGER;
