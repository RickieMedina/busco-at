import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';


const createSchema = z.object({
    name: z.string()
          .min(1, "El nombre del tipo es requerido")
          .max(255, "El nombre del tipo debe tener menos de 255 caracteres")
});

export async function POST(request: Request) {

    try {
        const body = await request.json();

        const { name } = createSchema.parse(body);

        const newHealtType = await db.health_care_type.create(
            {data: { name}}
        )

        return NextResponse.json(newHealtType, { status: 200 });

    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function GET(request: Request) {

    try {
        const healtTypes = await db.health_care_type.findMany();

        return NextResponse.json(healtTypes, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}


const updateSchema = z.object({
    id: z.number().int().positive("El ID debe ser un número positivo"),
    name: z.string().min(1, "El nombre del tipo es requerido").max(255, "El nombre del tipo debe tener menos de 255 caracteres")

});
export async function PUT(request: Request) {

    try {
        const body = await request.json();

        const { id, name } = updateSchema.parse(body);

        const healtTypeExists = await db.health_care_type.findFirst(
            { where: { health_care_type_id: id } }
        );

        if(!healtTypeExists){
            return NextResponse.json({ error: 'El área de atención no existe' }, { status: 404 });
        }

        const updatedHealtType = await db.health_care_type.update(
            { where: {health_care_type_id: id },
              data: { name } 
            }
        )

        return NextResponse.json(updatedHealtType, { status: 200 });

    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

const deleteSchema = z.object({
    id: z.number().int().positive("El ID debe ser un número positivo")
});

export async function DELETE(request: Request) {

    try {
        const body = await request.json();

        const { id } = deleteSchema.parse(body);

        const healtTypeExists = await db.health_care_type.findFirst(
            { where: { health_care_type_id: id } }
        );

        if(!healtTypeExists){
            return NextResponse.json({ error: 'El area de atención no existe' }, { status: 404 });
        }

        const healtTypeExistsInProfessional = await db.professional_patient.findFirst(
            { where: { patient_type_id: id } }
        );
        
        if(healtTypeExistsInProfessional){
            return NextResponse.json({ error: 'El area de atención está asociada a un profesional' }, { status: 400 });
        }

        const healtTypeDeleted = await db.health_care_type.delete(
            { where: { health_care_type_id: id } }
        )

        return NextResponse.json(healtTypeDeleted, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}