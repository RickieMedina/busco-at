import { db } from "@/lib/db";
import { formOfferSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import { scheduler } from "timers/promises";

export async function POST(request: Request, { params }: { params: { userId: string } }) {

    try {
        const { userId } = params;
        const body = await request.json();
        const employer = await db.employer.findFirst({where: { user_id: userId }});
        const date= new Date();
        const { data, success } = formOfferSchema.safeParse(body);

        if(!data || !userId || !employer){
            return NextResponse.json({ error: 'data inválida' }, { status: 400 });
        }

        const genders = await db.gender_type.findMany();
        const gender_id = genders.find((i) => i.name === data.gender)?.gender_id; 

        if(gender_id === undefined){
            return NextResponse.json({error: 'Tipo de género inválido'}, {status:400});
        }
       
        if(data.paymentType.private === false && data.paymentType.socialSecurity === false){
            return NextResponse.json({error: 'Al menos un tipo de pago debe ser seleccionado'}, {status:400});
        }
        
        if(data.schedule.length === 0){
            return NextResponse.json({error: 'Debe seleccionar al menos un horario'}, {status:400});
        }
     
        const address: string = `${data.address.calle} ${data.address.numero}`;
        
        const days_hours: string [] = data.schedule.map((s) => {
             return `${s.day}-${s.startTime}-${s.endTime}`
        });
        
        const offerAdd = await db.job_offer.create({
            data: {
                name: data.title,
                description: data.description,
                created_date: new Date(),
                update_date: new Date(),
                employer_id: employer!.employer_id,
                gender: gender_id,
                age_from: data.ageRange.min,
                age_to: data.ageRange.max,
                require_certificate: data.requiresCertificate,
                days_hours: days_hours.join(','),
                address: address,
                diagnosis: data.diagnosis,
                social_security: data.paymentType.socialSecurity,
                private: data.paymentType.private,
                observations: data.additionalObservations
            }
        });

        return NextResponse.json(offerAdd, { status: 200 });

        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });

    }
}



export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;

        const employer = await db.employer.findFirst({where: { user_id: userId }});
        if(!employer){
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const offerJob = await db.job_offer.findMany({where: {employer_id: employer.employer_id}});

        return NextResponse.json(offerJob, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}


