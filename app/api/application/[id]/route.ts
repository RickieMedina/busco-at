import { db } from "@/lib/db";
import { NotificationType, sendNotificationEmail } from "@/lib/resend";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const notify: boolean = true;


export async function PATCH(request: Request, {params}: {params: {id: string}}) {

    try {
        const {id} = params;
        const {application_status, job_offer_id} = await request.json();
        const application_id_selected = parseInt(id);

        const status: Status = application_status;

        if(!application_status || !application_id_selected || !job_offer_id){
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }

        const applications = await fetchApplications(job_offer_id);
        //Si quiero aceptar entonces rechazo las demas postulaciones y finalizo el offer.
        if (status === Status.aceptada) {

        const applicationsUpdated = await db.$transaction([
                // Primero rechazar todas las postulaciones del job_offer
                db.application.updateMany({
                where: {job_offer_id: job_offer_id,application_id: { not: application_id_selected}},
                data: {application_status: Status.rechazada}
                }),
                // Luego aceptar la postulación específica
                db.application.update({where: { application_id: application_id_selected},
                    data: {application_status: Status.aceptada}
                }),

                db.job_offer.update({ where: {job_offer_id: job_offer_id},
                    data: { end_date: new Date() }//Colocamos fecha fin.
                })
            ]);
        }

        if(status === Status.rechazada){
            const applicationUpdated = await db.application.update({
                where: { application_id:application_id_selected },
                data: {
                    application_status: Status.rechazada
                }
            });        
        }

        if(notify && (status === Status.aceptada)){
            applications.forEach(async (application: any) => {
                const email = application.professional?.users?.email!;
                if(application.application_id === application_id_selected){
                    await sendNotificationEmail(email, NotificationType.ACCEPTED);
                    await db.application.update({
                        where: { application_id: application.application_id },
                        data: { notified_date: new Date() }
                    })
                }
                else
                { //Sólo envío notificación a los que no fueron tratadas individualmente que tendrían un notify
                    if(application.notified_date === null){
                        await db.application.update({
                            where: { application_id: application.application_id },
                            data: {notified_date: new Date()}
                        });
                        await sendNotificationEmail(email, NotificationType.CANCELED);                        
                    }
                }
            });
        }

        if(notify && (status === Status.rechazada)){
            await db.application.update({
                where: { application_id: application_id_selected},
                data: {notified_date: new Date()}
            });
            const email = applications.find(app => app.application_id === application_id_selected)?.professional?.users?.email!;
            await sendNotificationEmail(email, NotificationType.REJECTED);
        }

        return NextResponse.json('applications updated ', { status: 200 });

    } catch (error) {
        console.log(JSON.stringify(error));
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        
    }
}


interface ApplicationUpdate {
    application_id: number;
    application_status: Status;
    application_date: Date | null;
    notified_date: Date | null;
    professional: Professional | null;
}

interface Professional {
users: User | null;
}

interface User {
email: string | null;
}

const fetchApplications = async (job_offer_id: number): Promise<ApplicationUpdate[]> => {

    return await db.application.findMany({
            where: {
              job_offer_id: job_offer_id
            },
            select: {
              application_id: true,
              application_status: true,
              application_date: true,
              notified_date: true,
              professional: {
                select: {
                  users: {
                    select: {
                      email: true
                    }
                  }
                }
              }
            }
        });
}