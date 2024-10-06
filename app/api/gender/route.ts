import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    try {
        const healtTypes = await db.gender_type.findMany();

        return NextResponse.json(healtTypes, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
