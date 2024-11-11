import {Resend} from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export enum NotificationType {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
}

export const getTemplate = (type: NotificationType): string => {
    const filePath = path.join(process.cwd(), 'public', 'templates', `${type}.html`);
    return fs.readFileSync(filePath, 'utf-8');
};

export const sendNotificationEmail = async (email: string, type: NotificationType ) => {

    try {
        const subjectMap = {
            [NotificationType.ACCEPTED]: 'Postulación Aceptada',
            [NotificationType.REJECTED]: 'Postulación Rechazada',
            [NotificationType.CANCELED]: 'Oferta Cancelada',
        };

        const subject = subjectMap[type];
        const htmlMessage = getTemplate(type);

    
        await resend.emails.send({
           from:"BuscoAT <onboarding@resend.dev>",
           to:email,
           subject: subject,
           html: htmlMessage
        })

        return {
           success: true,
        }
        
   } catch (error) {
       console.log(error);
       return {
           success: false,
       }
   }
};



export const sendEmail = async (email: string, subject: string, htmlMessage: string) => {

    try {
         await resend.emails.send({
            from:"BuscoAT <onboarding@resend.dev>",
            to:email,
            subject: subject,
            html: htmlMessage
         })

         return {
            success: true,
         }
    } catch (error) {
        console.log(error);
        return {
            success: false,
        }
    }
}
    
