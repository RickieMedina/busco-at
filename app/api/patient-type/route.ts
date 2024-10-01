import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';


const patientTypeSchema = z.object({
    name: z.string()
          .min(1, "El nombre del tipo es requerido")
          .max(255, "El nombre del tipo debe tener menos de 255 caracteres")
});

export async function POST(request: Request) {

    try {
        const body = await request.json();

        const { name } = patientTypeSchema.parse(body);

        const newPatientType = await db.patient_type.create(
            {data: { name}}
        )

        return NextResponse.json(newPatientType, { status: 200 });

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
        const patientTypes = await db.patient_type.findMany();

        return NextResponse.json(patientTypes, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}


const updateSchema = patientTypeSchema.extend({
    id: z.number().int().positive("El ID debe ser un número positivo"),
    name: z.string().min(1, "El nombre del tipo es requerido").max(255, "El nombre del tipo debe tener menos de 255 caracteres")
});

export async function PUT(request: Request) {

    try {
        const body = await request.json();

        const { id, name } = updateSchema.parse(body);

        const patientTypeExists = await db.patient_type.findFirst(
            { where: { patient_type_id: id } }
        );

        if(!patientTypeExists){
            return NextResponse.json({ error: 'El tipo de paciente no existe' }, { status: 404 });
        }

        const updatedPatientType = await db.patient_type.update(
            { where: {patient_type_id: id },
              data: { name } 
            }
        )

        return NextResponse.json(updatedPatientType, { status: 200 });

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

        const patientTypeExists = await db.patient_type.findFirst(
            { where: { patient_type_id: id } }
        );

        if(!patientTypeExists){
            return NextResponse.json({ error: 'El tipo de paciente no existe' }, { status: 404 });
        }

        const patientTypeExistsInProfessional = await db.professional_patient.findFirst(
            { where: { patient_type_id: id } }
        );
        
        if(patientTypeExistsInProfessional){
            return NextResponse.json({ error: 'El tipo de paciente está asociado a un profesional' }, { status: 400 });
        }

        await db.patient_type.delete(
            { where: { patient_type_id: id } }
        )

        return NextResponse.json({ message: 'Tipo de paciente eliminado' }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}