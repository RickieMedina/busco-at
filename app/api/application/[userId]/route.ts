import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request: Request, {params} : {params: {userId: string}}) {

    try {
        const {userId} = params;
        const {offer_id} = await request.json();

        if(!offer_id || !userId){
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }
        
        const professional = await db.professional.findFirst({
            where: { user_id: userId },
        });
        //TODO: validar que no este registrado ya en la misma.. 
        if (!professional) {
            return NextResponse.json({ error: 'Identificación de profesional inválida' }, { status: 400 });
        }

        const applicationProfesional = await db.application.findFirst({
            where: {
                professional_id: professional.professional_id,
                job_offer_id: offer_id
            }
        });

        if(applicationProfesional){
            return NextResponse.json({ error: 'Ya se encuentra registrado en la oferta' }, { status: 400 });
        }

        const application= await db.application.create({
            data: {
                professional_id: professional.professional_id,
                job_offer_id: offer_id,
                application_date: new Date(),
                application_status: 'pendiente'
            }
        });

        return NextResponse.json(application, { status: 200 });

    }
    catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

