import { OfferStatus } from "@/lib/constants/offer-status";

export type Address = {
  pais?: string,
  provincia?:string
  localidad?: string
  calle: string
  numero: string
}

export type Offer = {
    id?: number;
    createdAt?: Date,
    endDate?: Date,
    status?: OfferStatus;
    title: string;
    description: string,
    gender: number;// debería pasarlo a string
    address: Address,
    location: {
      latitude?: number
      longitude?: number
    },
    ageRange: {
      min: number
      max: number
    },
    requiresCertificate: boolean,
    paymentType: {
      socialSecurity: boolean,
      private: boolean,
    },
    diagnosis: string,
    additionalObservations: string,
    schedule: {
      day: string,
      startTime: string,
      endTime: string,
    }[]
}
