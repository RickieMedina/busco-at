import { db } from "@/lib/db";
import { NotificationType, sendNotificationEmail } from "@/lib/resend";
import { OfferStatus, Status } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const body = await request.json();
        const { job_offer_id } = body;

        // Validaciones básicas
        if (!job_offer_id || !userId) {
            return NextResponse.json({ error: 'Datos requeridos inválidos' }, { status: 400 });
        }

        // Obtener el employer_id del usuario
        const employer = await db.employer.findFirst({
            where: { user_id: userId }
        });

        if (!employer) {
            return NextResponse.json({ error: 'Usuario no es un empleador' }, { status: 403 });
        }

        // Verificar que la oferta existe y obtener su información
        const offer = await db.job_offer.findUnique({
            where: { job_offer_id: job_offer_id },
            select: {
                job_offer_id: true,
                employer_id: true,
                status: true,
                name: true
            }
        });

        if (!offer) {
            return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
        }

        // Validar que el empleador es el dueño de la oferta
        if (offer.employer_id !== employer.employer_id) {
            return NextResponse.json({ 
                error: 'No tiene permisos para cancelar esta oferta' 
            }, { status: 403 });
        }

        // Validar que la oferta esté en estado ACTIVE
        if (offer.status !== OfferStatus.ACTIVE) {
            return NextResponse.json({ 
                error: `No se puede cancelar una oferta en estado ${offer.status}` 
            }, { status: 400 });
        }

        // Obtener todas las postulaciones pendientes para notificar
        const pendingApplications = await db.application.findMany({
            where: {
                job_offer_id: job_offer_id,
                application_status: Status.pendiente
            },
            select: {
                application_id: true,
                professional: {
                    select: {
                        users: {
                            select: {
                                email: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Cancelar la oferta y actualizar las postulaciones en una transacción
        await db.$transaction([
            // Actualizar la oferta a CANCELLED
            db.job_offer.update({
                where: { job_offer_id: job_offer_id },
                data: {
                    status: OfferStatus.CANCELLED,
                    end_date: new Date()
                }
            }),
            // Actualizar todas las postulaciones pendientes a canceladas
            db.application.updateMany({
                where: {
                    job_offer_id: job_offer_id,
                    application_status: Status.pendiente
                },
                data: {
                    application_status: Status.cancelada,
                    notified_date: new Date()
                }
            })
        ]);

        // Enviar notificaciones a todos los postulantes pendientes
        const notificationPromises = pendingApplications.map(async (application) => {
            const email = application.professional?.users?.email;
            if (email) {
                try {
                    await sendNotificationEmail(email, NotificationType.CANCELED);
                } catch (emailError) {
                    console.error(`Error enviando email a ${email}:`, emailError);
                }
            }
        });

        // Esperar a que todas las notificaciones se envíen
        await Promise.allSettled(notificationPromises);

        return NextResponse.json({
            message: 'Oferta cancelada exitosamente',
            notified_count: pendingApplications.length
        }, { status: 200 });

    } catch (error) {
        console.error('Error cancelando oferta:', error);
        return NextResponse.json({ error: 'Error interno al cancelar la oferta' }, { status: 500 });
    }
}
