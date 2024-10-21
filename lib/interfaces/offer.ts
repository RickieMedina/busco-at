
export interface IOffer {
    job_offer_id: number,
    name: string,
    description: string,
    created_date: Date,
    end_date: null,
    employer_id: number,
    gender: number,
    age_from: number,
    age_to: number,
    require_certificate: true,
    days_hours: string,
    address: string,
    latitude: number,
    longitude: number,
    diagnosis: string,
    social_security: boolean,
    private: boolean,
    observations: string
}