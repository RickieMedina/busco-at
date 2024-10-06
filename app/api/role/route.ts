import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';

export async function GET(request: Request) {

    try {
        const roles = Object.values(Role);
        const roleFilter = roles.filter(role => role !== 'admin');
        return NextResponse.json(roleFilter, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
