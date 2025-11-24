import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
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


export async function GET(request:Request, {params} : {params: {userId: string}}) {
    
        try {
            const {userId} = params;
    
            if(!userId){
                return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
            }
            
            const applications = await db.application.findMany({
                where: {professional: {user_id: userId}},
                include:{
                    job_offer: true,
                }
            });

            return NextResponse.json(applications, { status: 200 });

        } catch (error) {
            console.log(JSON.stringify(error));
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
}


export async function DELETE(request: Request, {params} : {params: {userId: string}}) {
    
        try {
            const {userId} = params;
            const body  = await request.json();
            const {applicationId} = body;
    
            if(!userId || !applicationId){
                return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
            }

            const professional = await db.professional.findFirst({where: { user_id: userId }});

            const applicationById = await db.application.findFirst({
                where: {application_id: parseInt(applicationId),
                        professional_id: professional?.professional_id
                }
            });

            if(!applicationById){
                return NextResponse.json({ error: 'Identificación de postulación inválida' }, { status: 400 });
            }

            if(applicationById?.application_status !== Status.pendiente){
                return NextResponse.json({ error: 'Su postulación ya fue procesada' }, { status: 400 });
            }

            const application= await db.application.delete({
                where: {
                    professional_id: professional?.professional_id,
                    application_id: parseInt(applicationId)
                }
            });
            //TODO: verifcar Validate - add notification to employer
            revalidatePath(`/empleador/ofertas`);
            revalidatePath(`/profesional/postulaciones`);

            return NextResponse.json(application, { status: 200 });
        }
        catch (error) {
            console.log(JSON.stringify(error));
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
}