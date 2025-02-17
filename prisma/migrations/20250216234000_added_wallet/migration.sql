/*
  Warnings:

  - You are about to drop the column `importId` on the `parcels` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `parcels` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "parcels" DROP COLUMN "importId",
DROP COLUMN "paymentId",
ADD COLUMN     "event_id" TEXT,
ADD COLUMN     "occurred_at" TIMESTAMP(3),
ADD COLUMN     "payment_id" TEXT;

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "crypto_type" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,
    "crypto_type" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "transaction_id" TEXT,
    "notes" TEXT,

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "transaction_id" TEXT,

    CONSTRAINT "payment_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
