
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formProfessionalSchema } from '@/lib/zod';
import { fetchPatientTypes } from '@/lib/constants/patient-type';
import { fetchHealthCareTypes } from '@/lib/constants/healt-care-type';

// GET /api/professional/[id] BY user_id
export async function GET(request: Request,   { params }: { params: { id: string } }) {

    const { id } = params;
    try {
        const professional  = await db.professional.findFirst({
            where: { user_id : id }
        });

        return NextResponse.json(professional, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const body = await request.json();
        
        const { social_security, private: privateWork, hourly_rate, observations } = body;

        const professional = await db.professional.updateMany({
            where: { user_id: userId },
            data: {
                social_security,
                private: privateWork,
                hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
                observations
            }
        });

        if (professional.count === 0) {
            return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Perfil actualizado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error actualizando profesional:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(request: Request,  { params }: { params: { userId: string } }) {

    try {
        const {userId} = params;
        const body = await request.json();
        
        const {data, success} = formProfessionalSchema.safeParse(body);

        const identification_type = await db.identification_type.findMany();
        const identification_type_id =  identification_type.find((i) => i.name === data?.identification_type)?.identification_id;

        if (!identification_type_id) {
            return NextResponse.json({ error: 'Tipo de identificación inválido' }, { status: 400 });
        }

        const patientTypes = await fetchPatientTypes();
        const healthCareTypes = await fetchHealthCareTypes();

        if(healthCareTypes.length === 0 || patientTypes?.length === 0){
            return NextResponse.json({ error: 'Error al obtener los tipos de atención' }, { status: 500 });
        }

        const paymentTypeTrue = data?.paymentType.socialSecurity || data?.paymentType.private;
        if(!paymentTypeTrue){
            return NextResponse.json({ error: 'Debe seleccionar al menos un tipo de pago' }, { status: 400 });
        }

        //Validate if user is already an employer or professional
        const [isEmployer, isProfessional] = await Promise.all([
            db.employer.findFirst({
              where: { user_id: userId },
            }),
            db.professional.findFirst({
              where: { user_id: userId },
            }),
          ]);

        if (isEmployer || isProfessional) {
            return NextResponse.json({ error: 'Usuario ya es empleador o profesional' }, { status: 400 });
        }

        const profileAdded = await db.$transaction(async (transaction) => {
            // Create the professional and take the id to create the attachment
            const professional = await transaction.professional.create({
              data: {
                user_id: userId,
                identification_type: identification_type_id,
                identification_number: data?.identification_number,
                social_security: data?.paymentType.socialSecurity,
                private: data?.paymentType.private,
                hourly_rate: data?.hourly_rate ? parseFloat(data.hourly_rate) : undefined,
                observations: data?.observations
              },
            });

            //Recorrer la lista de health_care_type y patient_type para crear los registros en la tabla de relacion
            data?.health_care_type.forEach(async (element) => {
                await transaction.professional_care_type.create({
                    data: {
                        professional_id: professional.professional_id,
                        health_care_type_id: healthCareTypes.find((i) => i.name === element)?.health_care_type_id
                    }
                });
            });

            data?.patient_type.forEach(async (element) => {

                await transaction.professional_patient.create({
                    data: {
                        professional_id: professional.professional_id,
                        patient_type_id: patientTypes?.find((i) => i.name === element)?.patient_type_id
                    }
                });
            });

            const attachment = await transaction.attachment.create({
              data: {
                professional_id: professional.professional_id, 
                attachment_type: 1, //type 1 is c.v
                created_at: new Date(),
                file_location: data?.url
              },
            });

            const updated = await transaction.users.update({
                where: { user_id: userId },
                data: {  
                  profile_completed: true,
                  updated_at: new Date() 
                },
              });
          
            return [professional, attachment, updated];
          });

        if(!profileAdded[0] || !profileAdded[1] || !profileAdded[2]){
            return NextResponse.json({ error: 'Error al crear perfil de profesional' }, { status: 400 });
        }
        else{
            return NextResponse.json(profileAdded, { status: 200 });
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
