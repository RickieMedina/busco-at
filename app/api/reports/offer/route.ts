import { db } from "@/lib/db";
import { subMonths } from "date-fns";
import { NextResponse } from "next/server";

interface GroupedByMonthYear {
    [key: string]: {
      offers_count: number;
      applications_count: number;
      applications_accepted: number;
    };
  }


export async function GET(request: Request) {

    try {

        const now = new Date();
        const twelveMonthsAgo = subMonths(now, 12);


        const jobOffers = await db.job_offer.findMany({
            where: {
            created_date: {
                gte: twelveMonthsAgo,
            },
            },
            select: {
            job_offer_id: true,
            created_date: true,
            application: {
                select: {
                application_id: true,
                application_status: true,
                },
            },
            },
        });

        // Agrupar por mes y año
        const groupedByMonthYear = jobOffers.reduce((acc, offer) => {
        const createdDate = offer.created_date;
        if (createdDate) {
        const date = new Date(createdDate);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Formato YYYY-MM

        if (!acc[monthYear]) {
            acc[monthYear] = { offers_count: 0, applications_count: 0, applications_accepted: 0 };
        }

        acc[monthYear].offers_count += 1;
        acc[monthYear].applications_count += offer.application.length;
        acc[monthYear].applications_accepted += offer.application.filter(app => app.application_status === 'aceptada').length;
        }
            return acc;
        }, {} as GroupedByMonthYear);

        // Incluyo los últimos 12 meses aunque no tenga datos.
        const result = [];
        for (let i = 0; i < 12; i++) {
          const date = subMonths(now, i);
          const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
          result.push({
            mes: date.getMonth() + 1,
            anio: date.getFullYear(),
            offers_count: groupedByMonthYear[monthYear]?.offers_count || 0,
            applications_count: groupedByMonthYear[monthYear]?.applications_count || 0,
            applications_accepted: groupedByMonthYear[monthYear]?.applications_accepted || 0,
          });
        }
      
        result.reverse(); 

        return NextResponse.json(result, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
