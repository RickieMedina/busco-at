import { db } from '@/lib/db';

export const fetchProvinces = async () => {
    try {
        const provinces = await db.province.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return provinces;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return [];
    }
};
