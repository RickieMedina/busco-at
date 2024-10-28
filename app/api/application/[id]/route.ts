import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";



export async function PATCH(request: Request, {params}: {params: {id: string}}) {

    try {
        const {id} = params;
        const {application_status} = await request.json();

        const status: Status = application_status;

        if(!application_status || !id){
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }

        const applicationUpdated = await db.application.update({
            where: { application_id: parseInt(id) },
            data: {
                application_status: status
            }
        });

       // revalidatePath('/empleador/ofertas');

        return NextResponse.json(applicationUpdated, { status: 200 });

    } catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        
    }
}
