-- AlterTable
ALTER TABLE "parcels" ADD COLUMN     "import_id" INTEGER,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "labels" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "success" BOOLEAN,
ADD COLUMN     "tracking" TEXT;
