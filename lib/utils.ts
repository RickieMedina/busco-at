import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IOffer } from "./interfaces/offer"
import { Offer } from "@/types/offer"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const  mapIOfferToTypeOffer = (offers: IOffer[]): Offer[] => {

  return offers.map((offer) => {
              return {
                  id: offer.job_offer_id,
                  createdAt: offer.created_date,
                  title: offer.name,
                  description: offer.description,
                  gender: offer.gender ,// debería pasarlo a string
                  address: {
                  pais: "Argentina",
                  calle: offer.address.split(',,')[0], //TODO: revisar como guardare la dirección. 
                  numero: offer.address.split(',,')[1]
                  },
                  location: {
                    latitude: offer.latitude,
                    longitude: offer.longitude
                    },
                  ageRange: {
                  min: offer.age_from,
                  max: offer.age_to
                  },
                  requiresCertificate: offer.require_certificate,
                  paymentType: {
                  socialSecurity: offer.social_security,
                  private: offer.private,
                  },
                  diagnosis: offer.diagnosis,
                  additionalObservations: offer.observations,
                  schedule: offer.days_hours.split(',').map((day_hour) => {
                      const [day, startTime, endTime] = day_hour.split('-');
                      return {
                          day: day,
                          startTime: startTime,
                          endTime: endTime
                      };
                  })
              };
          })
}
