import { db } from "@/lib/db";
import { differenceInYears, isAfter, subMonths } from "date-fns";
import { NextResponse } from "next/server";

interface GroupedByMonthYear {
    [key: string]: {
      professionals: any[];
      totalAge: number;
      count: number;
    };
  }

export async function GET(request: Request) {

    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);

        const careTypeId = params.get('careTypeId') 
        const patientTypeId = params.get('patientTypeId');
        console.log(careTypeId, patientTypeId);
        const desiredHealthCareTypeId = careTypeId === 'null' || careTypeId === 'NaN'? null : parseInt(careTypeId!); 
        const desiredPatientTypeId = patientTypeId === 'null'|| patientTypeId === 'NaN' ? null: parseInt(patientTypeId!);

        const whereClause: any = {};

        if (desiredHealthCareTypeId !== null) {
        whereClause.professional_care_type = {
            some: {
            health_care_type_id: { equals: desiredHealthCareTypeId },
            },
        };
        }

        if (desiredPatientTypeId !== null) {
        whereClause.professional_patient = {
            some: {
            patient_type_id: { equals: desiredPatientTypeId },
            },
        };
        }

        let professional = await db.professional.findMany({
        where: whereClause,
        include: {
            professional_care_type: {
            select: { health_care_type_id: true },
            },
            professional_patient: {
            select: { patient_type_id: true },
            },
            users: {
            select: {
                user_id: true,
                created_at: true,
                birth_date: true,
            },
            },
        },
        });
    
        const professionalsWithAge = professional.map(professional => ({
            ...professional,
            age: calculateAge(professional.users!.birth_date),
        }));

        // Agrupar por mes de registro y calcular la cantidad de profesionales y la edad promedio
        const groupedByMonthYear = professionalsWithAge.reduce((acc: GroupedByMonthYear, professional) => {
            const createdAt = professional.users!.created_at;
            if (createdAt) {
                const date = new Date(createdAt);
                const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Formato YYYY-MM
                if (!acc[monthYear]) {
                acc[monthYear] = { professionals: [], totalAge: 0, count: 0 };
                }
                if (professional.age !== null) {
                acc[monthYear].professionals.push(professional);
                acc[monthYear].totalAge += professional.age;
                acc[monthYear].count += 1;
                }
            }
            return acc;
            }, {} as GroupedByMonthYear);
        
            // Filtrar los resultados para incluir solo los últimos 12 meses
            const now = new Date();
            const twelveMonthsAgo = subMonths(now, 12);
            const result = Object.keys(groupedByMonthYear)
            .filter(monthYear => {
                const [year, month] = monthYear.split('-').map(Number);
                const date = new Date(year, month - 1);
                return isAfter(date, twelveMonthsAgo);
            })
            .map(monthYear => {
                const group = groupedByMonthYear[monthYear];
                return {
                mes: monthYear,
                profesionales_registrados: group.count,
                edad_promedio: group.totalAge / group.count,
                };
            });
          


        return NextResponse.json(result, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

function calculateAge(birthDate: Date | null): number | null {
    if (!birthDate) return null;
    return differenceInYears(new Date(), birthDate);
}