import { Professional } from "@/lib/interfaces/professional";
import { Employer } from "@/lib/interfaces/employer";
import { Users } from "@/lib/interfaces/user";

export interface UserProfile {
    user_id:               string;
    name:                  string;
    last_name:             string;
    email:                 string;
    password_hash:         string;
    email_verified?:        null;
    identification_type:   number;
    identification_number: string;
    birth_date:            Date;
    gender:                number;
    phone:                 string;
    address:               string;
    latitude?:             null;
    longitude?:            null;
    image?:                null;
    role:                  string;
    profile_completed:     boolean;
    created_at:            Date;
    updated_at?:           Date;
    is_active:             boolean;
    professional?: Professional[];
    employer?: Employer[];
}
