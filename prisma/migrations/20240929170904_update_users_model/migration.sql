-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'profesional', 'empleador');

-- CreateTable
CREATE TABLE "application" (
    "application_id" SERIAL NOT NULL,
    "professional_id" INTEGER,
    "job_offer_id" INTEGER,
    "application_date" DATE,
    "application_status" VARCHAR(255),

    CONSTRAINT "application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "attachment_id" SERIAL NOT NULL,
    "professional_id" INTEGER,
    "attachment_type" INTEGER,
    "created_at" DATE,
    "end_date" DATE,
    "file_location" VARCHAR(255),

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "attachment_type" (
    "attachment_type" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),

    CONSTRAINT "attachment_type_pkey" PRIMARY KEY ("attachment_type")
);

-- CreateTable
CREATE TABLE "employer" (
    "employer_id" SERIAL NOT NULL,
    "user_id" VARCHAR(255),
    "company_name" VARCHAR(255),
    "phone" VARCHAR(255),
    "email" VARCHAR(255),

    CONSTRAINT "employer_pkey" PRIMARY KEY ("employer_id")
);

-- CreateTable
CREATE TABLE "gender_type" (
    "gender_id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "gender_type_pkey" PRIMARY KEY ("gender_id")
);

-- CreateTable
CREATE TABLE "health_care_type" (
    "health_care_type_id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "health_care_type_pkey" PRIMARY KEY ("health_care_type_id")
);

-- CreateTable
CREATE TABLE "identification_type" (
    "identification_id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "identification_type_pkey" PRIMARY KEY ("identification_id")
);

-- CreateTable
CREATE TABLE "job_offer" (
    "job_offer_id" SERIAL NOT NULL,
    "created_date" DATE,
    "end_date" DATE,
    "employer_id" INTEGER,
    "gender" INTEGER,
    "age_from" INTEGER,
    "age_to" INTEGER,
    "require_certificate" BOOLEAN,
    "days_hours" VARCHAR(255),
    "address" VARCHAR(255),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "diagnosis" VARCHAR(255),
    "social_security" BOOLEAN,
    "private" BOOLEAN,
    "observations" VARCHAR(255),

    CONSTRAINT "job_offer_pkey" PRIMARY KEY ("job_offer_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" VARCHAR(255),
    "notification_type" VARCHAR(255),
    "notification_date" DATE,
    "content" VARCHAR(255),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "patient_type" (
    "patient_type_id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "patient_type_pkey" PRIMARY KEY ("patient_type_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "application_id" INTEGER,
    "date" DATE,
    "amount" DECIMAL(10,2),
    "payment_status" VARCHAR(255),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "professional" (
    "professional_id" SERIAL NOT NULL,
    "user_id" VARCHAR(255),
    "social_security" BOOLEAN,
    "private" BOOLEAN,
    "health_care_type" INTEGER,
    "patient_type" INTEGER,
    "hourly_rate" DOUBLE PRECISION,
    "observations" VARCHAR(255),

    CONSTRAINT "professional_pkey" PRIMARY KEY ("professional_id")
);

-- CreateTable
CREATE TABLE "professional_care_type" (
    "professional_care_type_id" SERIAL NOT NULL,
    "professional_id" INTEGER,
    "health_care_type_id" INTEGER,

    CONSTRAINT "professional_care_type_pkey" PRIMARY KEY ("professional_care_type_id")
);

-- CreateTable
CREATE TABLE "professional_patient" (
    "professional_patient_id" SERIAL NOT NULL,
    "professional_id" INTEGER,
    "patient_type_id" INTEGER,

    CONSTRAINT "professional_patient_pkey" PRIMARY KEY ("professional_patient_id")
);

-- CreateTable
CREATE TABLE "rating" (
    "rating_id" SERIAL NOT NULL,
    "employer_id" INTEGER,
    "professional_id" INTEGER,
    "rating_type_id" INTEGER,
    "rating_score" INTEGER,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "rating_type" (
    "rating_type_id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "rating_type_pkey" PRIMARY KEY ("rating_type_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_token" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255),
    "expires" DATE,
    "created_at" DATE,
    "updated_at" DATE,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_token")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "email_verified" DATE,
    "identification_type" INTEGER,
    "identification_number" VARCHAR(255),
    "birth_date" DATE,
    "gender" INTEGER,
    "phone" VARCHAR(255),
    "address" VARCHAR(255),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "image" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'profesional',
    "created_at" DATE,
    "updated_at" DATE,
    "is_active" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_job_offer_id_fkey" FOREIGN KEY ("job_offer_id") REFERENCES "job_offer"("job_offer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_attachment_type_fkey" FOREIGN KEY ("attachment_type") REFERENCES "attachment_type"("attachment_type") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employer" ADD CONSTRAINT "employer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer"("employer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_gender_fkey" FOREIGN KEY ("gender") REFERENCES "gender_type"("gender_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("application_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_health_care_type_fkey" FOREIGN KEY ("health_care_type") REFERENCES "health_care_type"("health_care_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_patient_type_fkey" FOREIGN KEY ("patient_type") REFERENCES "patient_type"("patient_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_care_type" ADD CONSTRAINT "professional_care_type_health_care_type_id_fkey" FOREIGN KEY ("health_care_type_id") REFERENCES "health_care_type"("health_care_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_care_type" ADD CONSTRAINT "professional_care_type_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_patient" ADD CONSTRAINT "professional_patient_patient_type_id_fkey" FOREIGN KEY ("patient_type_id") REFERENCES "patient_type"("patient_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional_patient" ADD CONSTRAINT "professional_patient_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer"("employer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_rating_type_id_fkey" FOREIGN KEY ("rating_type_id") REFERENCES "rating_type"("rating_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gender_fkey" FOREIGN KEY ("gender") REFERENCES "gender_type"("gender_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_identification_type_fkey" FOREIGN KEY ("identification_type") REFERENCES "identification_type"("identification_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
