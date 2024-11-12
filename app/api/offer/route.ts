import { db } from "@/lib/db";
import { NextResponse } from "next/server";


type SearchData = {
    keyword: string;
    provincia: string;
    localidad: string;
}


const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};


export async function GET(request: Request) {

    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);

        const search = params.get('search') 

        const filters: SearchData = search? JSON.parse(search): {keyword: '', provincia: '', localidad: ''};
        

        const offerJob = await db.job_offer.findMany({
            orderBy: { created_date: 'desc' }
        });

        const filteredOffers = offerJob.filter(offer => {
            const addressParts = offer.address!.split(',,');
            const localidad = addressParts[2];
            const provincia = addressParts[3];

            const matchesKeyword = filters.keyword ? offer.name!.toLowerCase().includes(filters.keyword.toLowerCase()) : true;
            const matchesProvincia = filters.provincia ? 
                removeDiacritics(provincia.toLowerCase()).includes(removeDiacritics(filters.provincia.toLowerCase())) : true;
            const matchesLocalidad = filters.localidad ? 
                removeDiacritics(localidad.toLowerCase()).includes(removeDiacritics(filters.localidad.toLowerCase())) : true;
            return matchesKeyword && matchesProvincia && matchesLocalidad; 
        });


        return NextResponse.json(filteredOffers, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
