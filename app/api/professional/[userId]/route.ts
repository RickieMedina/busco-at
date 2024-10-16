
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

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

const formSchema = z.object({
    identification_type: z.string().min(1, 'Seleccione tipo de identificación'),
    identification_number: z.string().regex(/^(20|23|24|27|30|33|34)([0-9]{9}|-[0-9]{8}-[0-9])$/, 'CUIL/CUIT inválido'),
    health_care_type: z.string().min(1, 'El campo de atención es requerido'),
    patient_type: z.string().min(1, 'El tipo de paciente es requerido'),
    social_security: z.boolean().default(false),
    private: z.boolean().default(false),
    hourly_rate: z.string().min(1, 'El valor hora es requerido'),
    url: z.string().min(1, 'El archivo es requerido').optional(),
    observations: z.string().max(250, 'Las observaciones no pueden superar los 250 caracteres').optional()
})

export async function POST(request: Request,  { params }: { params: { userId: string } }) {

    try {
        const {userId} = params;
        const body = await request.json();
        
        const {data, success} = formSchema.safeParse(body);

        const identification_type = await db.identification_type.findMany();
        const identification_type_id =  identification_type.find((i) => i.name === data?.identification_type)?.identification_id;

        if (!identification_type_id) {
            return NextResponse.json({ error: 'Tipo de identificación inválido' }, { status: 400 });
        }

        const patient_type = await db.patient_type.findMany();
        const id_patient_type =  patient_type.find((i) => i.name === data?.patient_type)?.patient_type_id;

        if(!id_patient_type){
            return NextResponse.json({ error: 'Tipo de paciente inválido' }, { status: 400 });
        }
       
        const health_care_type = await db.health_care_type.findMany();
        const id_health_care_type =  health_care_type.find((i) => i.name === data?.health_care_type)?.health_care_type_id;

        if(!id_health_care_type){
            return NextResponse.json({ error: 'Tipo de atención inválido' }, { status: 400 });
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
                health_care_type: id_health_care_type,
                patient_type: id_patient_type,
                social_security: data?.social_security,
                private: data?.private,
                hourly_rate: data?.hourly_rate ? parseFloat(data.hourly_rate) : undefined,
                observations: data?.observations
              },
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
