import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params} : {params: {applicationId: string}} ){

    try {
        const {applicationId} = params;

        const payments = await db.payment.findMany({
            where: {application_id: parseInt(applicationId)}
        });

        return NextResponse.json(payments.length, { status: 200 });
    }
    catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}