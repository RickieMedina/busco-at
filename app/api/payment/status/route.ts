
import { db } from "@/lib/db";
import { MercadoPagoConfig, Payment} from "mercadopago";
import { NextResponse } from "next/server";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function POST(request: Request) {

    const req = await request.json(); 
    const body : {data: {id: string}} = req;
   
    const payment = await new Payment(mercadopago).get({id: body.data.id});
  
    if (payment.status === "approved") {

        const paymentId = await getPaymentByIdAPI(payment.id!)

        if(!paymentId){
            return;
        }

        const paymentIddb= await db.payment.findFirst({
            where: {payment_id: paymentId.id}
        });

        if(paymentIddb) {
            return;
        }

        const addPayment= await db.payment.create({
                data: {
                    payment_id: paymentId.id,
                    application_id: paymentId.metadata.application_id,
                    amount: parseFloat(paymentId.additional_info[0].unit_price),
                    date: new Date(paymentId.date_approved),
                    payment_status: payment.status
                }
        });
    }
    if(payment.status === "in_process"){
        console.log('*****************in_process*****************************')
    }

    if(payment.status === "rejected"){
        console.log('*****************rejected*****************************')
    }
  
    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, {status: 200});
  }

  interface AdditionalInfoItem {
    category_id: any;
    description: any;
    id: string;
    picture_url: any;
    quantity: string;
    title: string;
    unit_price: string;
  }
  
  interface PaymentId {
    additional_info: AdditionalInfoItem[];
    date_approved: string;
    date_created: string;
    date_last_updated: string;
    date_of_expiration: string | null;
    deduction_schema: string | null;
    description: string;
    id: number;
    metadata: {
      application_id: number;
    };
  }

export interface Item {
  category_id: any
  description: any
  id: string
  picture_url: any
  quantity: string
  title: string
  unit_price: string
}

export interface Metadata {
  application_id: number
}


export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response("ID is required", { status: 400 });
    }

    try {

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`,{
            method: 'GET',
            headers:{
                'authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
            }
        })
        
        const payment = await response.json();
        
        const paymentId: PaymentId = {
            additional_info: payment.additional_info.items,
            date_approved: payment.date_approved,
            date_created: payment.date_created,
            date_last_updated: payment.date_last_updated,
            date_of_expiration: payment.date_of_expiration,
            deduction_schema: payment.deduction_schema,
            description: payment.description,
            id: payment.id,
            metadata: payment.metadata
        }

    return  NextResponse.json(paymentId, { status: 200});

    } catch (error) {
        console.error('Error fetching payment:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}


export async function getPaymentByIdAPI(id: number): Promise<PaymentId | null> {
    if (!id) {
      throw new Error("ID is required");
    }
  
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch payment");
      }
  
      const payment = await response.json();
  
      const paymentId: PaymentId = {
        additional_info: payment.additional_info.items,
        date_approved: payment.date_approved,
        date_created: payment.date_created,
        date_last_updated: payment.date_last_updated,
        date_of_expiration: payment.date_of_expiration,
        deduction_schema: payment.deduction_schema,
        description: payment.description,
        id: payment.id,
        metadata: payment.metadata
      };
  
      return paymentId;
    } catch (error) {
      console.error('Error fetching payment:', error);
      return null;
    }
  }