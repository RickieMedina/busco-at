import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const professional = await db.professional.findFirst({
            where: { user_id: params.userId },
            select: { professional_id: true }
        });

        if (!professional) {
            return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
        }

        const ratings = await db.rating.findMany({
            where: {
                professional_id: professional.professional_id,
                rating_score: { gte: 1 }
            },
            include: {
                rating_type: { select: { rating_type_id: true, name: true } }
            }
        });

        if (ratings.length === 0) {
            return NextResponse.json({ hasRatings: false, totalRatings: 0, averageScore: 0, ratingsByType: [] });
        }

        const grouped: Record<number, { nameType: string; totalScore: number; ratingsReceived: number }> = {};
        
        for (const r of ratings) {
            const id = r.rating_type_id!;

            if (!grouped[id]) {
                grouped[id] = { nameType: r.rating_type?.name || '', totalScore: 0, ratingsReceived: 0 };
            }

            grouped[id].totalScore += r.rating_score || 0;
            grouped[id].ratingsReceived++;
        }

        const ratingsByType = Object.entries(grouped).map(([id, { nameType: name, totalScore: total, ratingsReceived: count }]) => ({
            type_id: +id,
            type_name: name,
            average: +(total / count).toFixed(1),
            count
        }));

        const totalScore = ratings.reduce((sum, r) => sum + (r.rating_score || 0), 0);

        return NextResponse.json({
            hasRatings: true,
            totalRatings: new Set(ratings.map(r => r.application_id)).size,
            averageScore: +(totalScore / ratings.length).toFixed(1),
            ratingsByType
        });

    } catch (error) {
        console.error('Error al obtener ratings:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
