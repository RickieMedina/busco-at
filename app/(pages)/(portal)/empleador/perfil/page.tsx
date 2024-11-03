'use client'
import Profile from "@/components/profile/profile";
import { UserProfile } from "@/lib/interfaces/user-profile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"; 


export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile>();

    const session = useSession();

    useEffect(() => {
        const fetchTypes = async () => {
            const response = await fetch(`/api/user/${session.data?.user.user_id}`, {cache: "no-store"});
            if (!response.ok) {
                return null;
            }
            const userData = await response.json();
            console.log(JSON.stringify(userData));
            setUser(userData);
        };

        fetchTypes();
    }, []);

    

    return (
        <>
        <div>
                {user && user['employer'] !== undefined && 

                        <Profile
                            user={user}
                            employer={user['employer'][0]}
                        /> 
                } 
         
        </div>
        </>
     );
}