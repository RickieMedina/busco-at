import Profile from "@/components/profile/profile";
//TODO: review type
const user= {
    user_id: "1b9b444f-31dc-40a0-ae39-89eec3d8ba21",
    name: "profesional",
    last_name: "proape",
    email: "profesional@test.com",
    identification_type: 1,
    identification_number: "30000000",
    birth_date: "2000-01-01T00:00:00.000Z",
    gender: 1,
    phone: "3516750000",
    address: "azul 111",
    image: null,
    role: "profesional" as "profesional" | "empleador",
    profile_completed: true,
    created_at: "2024-10-13T00:00:00.000Z",
  }
 
 const professional= {
    professional_id: 3,
    social_security: true,
    private: true,
    health_care_type: 4,
    patient_type: 19,
    hourly_rate: 2500,
    identification_type: 2,
    identification_number: "20000000001",
    observations: null,
  }
const employer= {
    employer_id: 1,
    company_name: "Test Company",
    phone: "3516750001",
    email: "employer@test.com",
  }


export default function ProfilePage() {
    
    return (
        <>
        <div>
        <Profile
            user={user}
            professional={professional}
            employer={employer}
        />
        </div>
        </>
     );
}