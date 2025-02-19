-- AlterTable
ALTER TABLE "parcels" ADD COLUMN     "date_creation" TIMESTAMP(3),
ADD COLUMN     "date_expedition" TIMESTAMP(3),
ADD COLUMN     "date_last_status" TIMESTAMP(3),
ADD COLUMN     "delivery_fee" INTEGER,
ADD COLUMN     "last_status" TEXT,
ADD COLUMN     "parcel_sub_type" TEXT,
ADD COLUMN     "parcel_type" TEXT,
ADD COLUMN     "payment_status" TEXT,
ADD COLUMN     "pin" TEXT,
ADD COLUMN     "qr_text" TEXT,
ALTER COLUMN "declared_value" DROP NOT NULL;
