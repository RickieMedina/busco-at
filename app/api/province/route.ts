import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/province - Get all provinces
export async function GET() {
    try {
        const provinces = await db.province.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(provinces, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error al obtener provincias' }, { status: 500 });
    }
}
