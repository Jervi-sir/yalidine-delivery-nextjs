/*
  Warnings:

  - The `from_wilaya_id` column on the `parcels` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `to_commune_id` column on the `parcels` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `to_wilaya_id` column on the `parcels` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `to_center_id` column on the `parcels` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "from_wilaya_id",
ADD COLUMN     "from_wilaya_id" INTEGER,
DROP COLUMN "to_commune_id",
ADD COLUMN     "to_commune_id" INTEGER,
DROP COLUMN "to_wilaya_id",
ADD COLUMN     "to_wilaya_id" INTEGER,
DROP COLUMN "to_center_id",
ADD COLUMN     "to_center_id" INTEGER;
