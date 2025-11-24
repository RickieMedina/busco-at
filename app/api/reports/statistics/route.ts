import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type UserData = {
    user_id: string;
    name: string;
    last_name: string;
    email: string;
    image: string | null;
};

type RatingTypeData = {
    total: number;
    count: number;
    typeName: string;
};

type ProfessionalRating = {
    user: UserData;
    ratingsByType: Record<string, RatingTypeData>;
};

// Función auxiliar: Agrupa ratings por usuario y tipo
function groupRatingsByUser(ratings: any[]): Record<string, ProfessionalRating> {
    const professionalRatings: Record<string, ProfessionalRating> = {};

    ratings.forEach(rating => {
        if (!rating.professional?.users) return;

        const userId = rating.professional.users.user_id;
        
        // Inicializar usuario si no existe
        if (!professionalRatings[userId]) {
            professionalRatings[userId] = {
                user: rating.professional.users,
                ratingsByType: {}
            };
        }

        const typeId = rating.rating_type_id?.toString() || 'unknown';
        const typeName = rating.rating_type?.name || 'Sin tipo';

        // Inicializar tipo si no existe
        if (!professionalRatings[userId].ratingsByType[typeId]) {
            professionalRatings[userId].ratingsByType[typeId] = {
                total: 0,
                count: 0,
                typeName: typeName
            };
        }

        // Acumular puntuación
        professionalRatings[userId].ratingsByType[typeId].total += rating.rating_score || 0;
        professionalRatings[userId].ratingsByType[typeId].count += 1;
    });

    return professionalRatings;
}

// Función auxiliar: Calcula promedios por tipo y promedio general
function calculateUserAverages(professionalRatings: Record<string, ProfessionalRating>) {
    return Object.entries(professionalRatings).map(([userId, data]) => {
        // Calcular promedio por cada tipo (solo los > 0)
        const ratingTypes = Object.entries(data.ratingsByType)
            .map(([typeId, typeData]) => ({
                type_id: parseInt(typeId),
                type_name: typeData.typeName,
                average: typeData.total / typeData.count
            }))
            .filter(type => type.average > 0);

        // Calcular promedio general de los tipos con puntuación
        const overallAverage = ratingTypes.length > 0
            ? ratingTypes.reduce((sum, type) => sum + type.average, 0) / ratingTypes.length
            : 0;

        return {
            user_id: userId,
            name: data.user.name,
            last_name: data.user.last_name,
            email: data.user.email,
            image: data.user.image,
            ratings_by_type: ratingTypes,
            overall_average: overallAverage
        };
    });
}

// Función auxiliar: Obtiene top 5 usuarios ordenados por promedio
function getTop5Users(users: any[]) {
    return users
        .sort((a, b) => b.overall_average - a.overall_average)
        .slice(0, 5);
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);

        const year = params.get('year');
        const month = params.get('month');

        if (!year || !month) {
            return NextResponse.json({ error: 'Se requieren los parámetros year y month' }, { status: 400 });
        }

        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
        }

        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

        // 1. Top 5 usuarios con mayor puntuación (rating_score >= 1)
        // Primero obtener las aplicaciones del período
        const applicationsInPeriod = await db.application.findMany({
            where: {
                application_date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                application_id: true
            }
        });

        const applicationIds = applicationsInPeriod.map(app => app.application_id);

        // Obtener ratings filtrados por application_id del período
        const ratings = await db.rating.findMany({
            where: {
                rating_score: {
                    gte: 1
                },
                application_id: {
                    in: applicationIds.length > 0 ? applicationIds : [-1] // -1 para que no retorne nada si no hay apps
                }
            },
            include: {
                professional: {
                    include: {
                        users: {
                            select: {
                                user_id: true,
                                name: true,
                                last_name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                },
                rating_type: {
                    select: {
                        rating_type_id: true,
                        name: true
                    }
                }
            }
        });

        // Procesar ratings: agrupar, calcular promedios y obtener top 5
        const professionalRatings = groupRatingsByUser(ratings);
        const usersWithAverages = calculateUserAverages(professionalRatings);
        const top5Users = getTop5Users(usersWithAverages);

        // 2. Promedio del valor hora de profesionales (registrados en el mes seleccionado)
        const professionals = await db.professional.findMany({
            where: {
                users: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                hourly_rate: {
                    not: null,
                    gt: 0
                }
            },
            select: {
                hourly_rate: true
            }
        });

        const hourlyRateAverage = professionals.length > 0
            ? professionals.reduce((sum, p) => sum + (p.hourly_rate || 0), 0) / professionals.length
            : 0;

        const hourlyRateData = {
            average: Math.round(hourlyRateAverage * 100) / 100,
            count: professionals.length,
            month: monthNum,
            year: yearNum
        };

        // 3. Provincias con mayor cantidad de ofertas creadas (en el mes seleccionado)
        const offers = await db.job_offer.findMany({
            where: {
                created_date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                address: true
            }
        });

        // Extraer provincia de la dirección (formato: "direccion,,localidad,,provincia")
        const provinceCount: Record<string, number> = {};

        offers.forEach(offer => {
            if (offer.address) {
                const addressParts = offer.address.split(',,');
                if (addressParts.length >= 4) {
                    const province = addressParts[3].trim();
                    provinceCount[province] = (provinceCount[province] || 0) + 1;
                }
            }
        });

        const provinceData = Object.entries(provinceCount)
            .map(([province, count]) => ({
                province,
                offers_count: count
            }))
            .sort((a, b) => b.offers_count - a.offers_count);

        return NextResponse.json({
            top_users: top5Users,
            hourly_rate: hourlyRateData,
            provinces: provinceData,
            period: {
                month: monthNum,
                year: yearNum
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error en estadísticas:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
