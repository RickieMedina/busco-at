import { patient_type } from "@prisma/client";

export async function fetchPatientTypes(): Promise<patient_type[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient-type`, {
            cache: 'force-cache', 
            next: { revalidate: 3600}, 
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch health care types:", error);
        return []; 
    }
}