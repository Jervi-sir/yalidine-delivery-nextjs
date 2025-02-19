/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `parcels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parcels_order_id_key" ON "parcels"("order_id");
