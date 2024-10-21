import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {

        const offerJob = await db.job_offer.findMany();

        return NextResponse.json(offerJob, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
