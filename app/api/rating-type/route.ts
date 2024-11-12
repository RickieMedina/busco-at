import { db } from "@/lib/db";
import { RatingType } from "@/types/rating";
import { NextResponse } from "next/server";

export async function GET(request:Request) {

            const descriptions =[
                    {name: "primer contacto", description: "Evalúa la rapidez y eficacia del primer contacto del profesional"},
                    {name: "documentacion", description: "Valora la calidad y actualización de la documentación proporcionada"},
                    { name: "perfil", description: "Califica la completitud y precisión del perfil del profesional"}
            ]
          
            try {

                const ratings= await db.rating_type.findMany();
                
                const ratingsTypes =ratings.map((ratingType) => {
                    let newRatingType : RatingType = {
                        rating_type_id: ratingType.rating_type_id,
                        name: ratingType.name || '',
                        description: descriptions.find((description) => description.name === ratingType.name)?.description
                    }

                    return newRatingType;
                });
                    
    
                return NextResponse.json(ratingsTypes, { status: 200 });
    
            } catch (error) {
                console.log(JSON.stringify(error));
                return NextResponse.json({ error: 'Error interno' }, { status: 500 });
            }
}
