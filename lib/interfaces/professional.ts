import { Users } from "./user";


export interface Professional {
    professional_id:       number;
    user_id:               string;
    social_security:       boolean;
    private:               boolean;
    professional_care_type: ProfessionalCareType[];
    professional_patient:   ProfessionalPatient[];
    hourly_rate:           number;
    identification_type:   number;
    identification_number: string;
    observations:          null;
    users:                 Users;
}

export interface ProfessionalCareType {
    professional_care_type_id: number,
      professional_id: number,
      health_care_type_id: number,
      health_care_type: {
        health_care_type_id: number,
        name: string,
      }
}

export interface ProfessionalPatient {
    professional_patient_id: number,
      professional_id: number,
      patient_type_id: number,
      patient_type: {
        patient_type_id: number,
        name: string,
      }
}
