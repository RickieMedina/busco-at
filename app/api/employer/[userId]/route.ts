
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// GET /api/employer/[id] BY user_id
export async function GET(request: Request,   { params }: { params: { id: string } }) {

    const { id } = params;

    try {
        const employer  = await db.employer.findFirst({
            where: { user_id : id }
        });

        return NextResponse.json(employer, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}


const formSchema = z.object({
    companyName: z.string().min(1, 'El nombre de empleador es requerido'),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    identification_type: z.string().min(1, 'Seleccione tipo de identificación'),
    identification_number: z.string().regex(/^(20|23|24|27|30|33|34)([0-9]{9}|-[0-9]{8}-[0-9])$/, 'CUIL/CUIT inválido'),
    email: z.string().email('Correo electrónico inválido').optional()
  })

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const body = await request.json();
        
        const { company_name, phone, email } = body;

        const employer = await db.employer.updateMany({
            where: { user_id: userId },
            data: {
                company_name,
                phone,
                email
            }
        });

        if (employer.count === 0) {
            return NextResponse.json({ error: 'Empleador no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Perfil actualizado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error('Error actualizando empleador:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

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

        const profileAdded = await db.$transaction([
            db.employer.create({
                data: {
                    user_id: userId,
                    company_name: data?.companyName,
                    phone: data?.phone,
                    identification_type:identification_type_id,
                    identification_number: data?.identification_number,
                    email: data?.email
            }}),
            db.users.update({
                where: { user_id: userId },
                data: {  
                        profile_completed: true,
                        updated_at: new Date()//TODO: check if is necessary update type to date time
                      },
            }),
          ]);

        if(!profileAdded[0] || !profileAdded[1]){
            return NextResponse.json({ error: 'Error al crear perfil de empleador' }, { status: 400 });
        }
        else{
            return NextResponse.json(profileAdded, { status: 200 });
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
