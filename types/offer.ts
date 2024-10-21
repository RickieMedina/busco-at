
export type Offer = {
    id?: number;
    createdAt?: Date,
    title: string;
    description: string,
    gender: number;// debería pasarlo a string
    address: {
      pais?: string,
      provincia?:string
      localidad?: string
      calle: string
      numero: string
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
