'use client'
import { ApplicationUser } from "@/components/professional/application-user";
import { mapUniqueIOfferToTypeOffer } from "@/lib/utils";
import { Offer } from "@/types/offer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface IApplicationUser {
    application_id: number;
    professional_id: number;
    job_offer_id: number;
    application_date: string;
    application_status: string;
    notified_date: string | null;
    job_offer: Offer;
  }
  

export default function ApplicationList() {
    const session = useSession();
    const [applications, setApplications] = useState<IApplicationUser[]>([]);
    //TODO: validate role?

    useEffect(() => {
        const fetchApplications = async () => {
            const response = await fetch(`/api/application/user/${session.data?.user.user_id}`, {cache: "no-store"});
            if (!response.ok) {
                return null;
            }
            const userApplications = await response.json();

            userApplications.map((application: any) => {
                application.job_offer = mapUniqueIOfferToTypeOffer(application.job_offer);
            });

            setApplications(userApplications);
        };

        fetchApplications();
    }, []);


    return (
        <>   
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold">Postulaciones</h1>
                {session.data?.user.user_id &&(
                        <ApplicationUser
                            applications={applications}
                            userId={session.data?.user.user_id}
                        />
                    )
                }
            </div>
        </>
    )
}