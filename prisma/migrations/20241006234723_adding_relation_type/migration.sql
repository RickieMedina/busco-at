-- AddForeignKey
ALTER TABLE "employer" ADD CONSTRAINT "employer_identification_type_fkey" FOREIGN KEY ("identification_type") REFERENCES "identification_type"("identification_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_identification_type_fkey" FOREIGN KEY ("identification_type") REFERENCES "identification_type"("identification_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
