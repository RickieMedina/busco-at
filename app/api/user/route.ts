import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request: Request){
    try {

        const userData = await db.users.findMany();
        
        if(!userData){
            return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 404 });
        }

        return NextResponse.json(userData, { status: 200 });
    }
    catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        
    }
}
