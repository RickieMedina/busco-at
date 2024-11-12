import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request:Request){

    try {
       
        const { ratings, application_id, professional_id, user_id } = await request.json();

        const scores: { [key: number]: number } = ratings;

        if(!ratings || !application_id || !professional_id || !user_id){
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const employer = await db.employer.findFirst({where: { user_id: user_id }});

        //enviar una calificación por cada rating
        for (const [rating_type_id, ranking] of Object.entries(scores)) {
            await db.rating.create({
                data: {
                    rating_type_id: parseInt(rating_type_id),
                    rating_score: ranking,
                    professional_id: professional_id,
                    employer_id: employer?.employer_id,
                    application_id: application_id
                }
            });
        }
       
        return NextResponse.json('application scored', { status: 200 });
      
    } 
    catch (error) {
        console.error("error",error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

