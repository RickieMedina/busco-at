import { db } from '@/lib/db';

export const fetchLocalities = async (provinceId?: number) => {
    try {
        const localities = await db.locality.findMany({
            where: provinceId ? {
                province_id: provinceId
            } : undefined,
            orderBy: {
                name: 'asc'
            },
            include: {
                province: true
            }
        });
        return localities;
    } catch (error) {
        console.error('Error fetching localities:', error);
        return [];
    }
};
