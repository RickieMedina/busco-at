-- CreateTable
CREATE TABLE "province" (
    "province_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("province_id")
);

-- CreateTable
CREATE TABLE "locality" (
    "locality_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "province_id" INTEGER,

    CONSTRAINT "locality_pkey" PRIMARY KEY ("locality_id")
);

-- AddForeignKey
ALTER TABLE "locality" ADD CONSTRAINT "locality_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("province_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
