import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request: Request, {params} : {params: {userId: string}} ){

    try {
        const {userId} = params;

        if(!userId){
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }
        
        const userData = await db.users.findUnique(
            { where : { user_id: userId },
              include:{
                professional: {
                    include: {
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
                        attachment: {
                            // where: {
                            //     end_date: null,
                            //   },
                            include: {
                              attachment_type_attachment_attachment_typeToattachment_type: true,
                            },
                          },
                    },
                },
                employer: true
              }

            }
        )

        if(!userData){
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(userData, { status: 200 });
    }
    catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        
    }
}
