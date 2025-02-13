-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "password_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcels" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "order_id" TEXT,
    "from_wilaya_name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "familyname" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "to_commune_name" TEXT NOT NULL,
    "to_wilaya_name" TEXT NOT NULL,
    "product_list" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "do_insurance" BOOLEAN NOT NULL,
    "declared_value" INTEGER NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "length" INTEGER,
    "weight" DOUBLE PRECISION,
    "freeshipping" BOOLEAN NOT NULL,
    "is_stopdesk" BOOLEAN NOT NULL,
    "stopdesk_id" INTEGER,
    "has_exchange" BOOLEAN NOT NULL,
    "product_to_collect" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parcels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "parcels" ADD CONSTRAINT "parcels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
