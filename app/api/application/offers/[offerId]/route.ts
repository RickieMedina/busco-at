import { db } from "@/lib/db";
import { Application } from "@/lib/interfaces/application";
import { NextResponse } from "next/server";



export async function GET(request: Request, {params} : {params: {offerId: string}}) {

    try {
        const {offerId} = params;

        if(!offerId){
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }
        //traer aplicacones y los profesionales que aplicaron a la oferta
        const applications = await db.application.findMany({
            where: { job_offer_id: parseInt(offerId)},
            include: {
                professional: {
                    include: {
                        users: true,
                        professional_care_type: {
                            include: {
                                health_care_type: true, 
                            },
                        },
                        professional_patient: {
                            include: {
                                patient_type: true, 
                            },
                        },
                    },
                   
                },
            },
        });
        
        console.log('Applications api:', applications);
        return NextResponse.json(applications, { status: 200 });

    }
    catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
