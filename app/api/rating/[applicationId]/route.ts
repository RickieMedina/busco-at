import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params} : {params: {applicationId: string}}) {
    
        try {
            const {applicationId} = params;
    
            if(!applicationId){
                return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
            }
            
            const ratings = await db.rating.findMany({
                where: {application_id: parseInt(applicationId)}
            });

            return NextResponse.json(ratings, { status: 200 });
    
        } catch (error) {
            console.log(JSON.stringify(error));
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
}