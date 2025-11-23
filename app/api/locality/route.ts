import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/locality?province_id=X - Get localities by province (optional filter)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const provinceId = searchParams.get('province_id');

        const localities = await db.locality.findMany({
            where: provinceId ? {
                province_id: parseInt(provinceId)
            } : undefined,
            orderBy: {
                name: 'asc'
            },
            include: {
                province: true
            }
        });

        return NextResponse.json(localities, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error al obtener localidades' }, { status: 500 });
    }
}
