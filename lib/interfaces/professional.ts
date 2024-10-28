import { Users } from "./user";


export interface Professional {
    professional_id:       number;
    user_id:               string;
    social_security:       boolean;
    private:               boolean;
    health_care_type:      number;
    patient_type:          number;
    hourly_rate:           number;
    identification_type:   number;
    identification_number: string;
    observations:          null;
    users:                 Users;
}
