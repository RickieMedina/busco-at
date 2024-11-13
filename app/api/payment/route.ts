import { MercadoPagoConfig, Preference} from "mercadopago";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: Request) {

    const body = await request.json();
    const { postId, applicationId, amount } = body; 

    try {
      const preference = await  new Preference(mercadopago).create({
        body:{
            items: [
                {
                  id: postId,
                  title: "Donación por postulación aceptada",
                  unit_price: amount,
                  quantity: 1,
                },
              ],
        metadata:{
          applicationId: applicationId,
        },
         back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/empleador/ofertas`, // URL de éxito URLs de retorno al sitio del vendedor, ya sea automáticamente ("auto_return") o a través del botón 'Volver al sitio', según el estado del pago
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/empleador/ofertas`, // URL de fallo
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/empleador/ofertas`, // URL pendiente
        }
        },
      });
      
      return NextResponse.json({ preference_init_point: preference.init_point });

    } catch (error) {

        console.log(error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

