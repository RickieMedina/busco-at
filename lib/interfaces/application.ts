import { Status } from "@prisma/client";
import { Professional } from "./professional";


export interface Application {
    application_id:     number;
    professional_id:    number;
    job_offer_id:       number;
    application_date:   Date;
    application_status: Status;
    professional?:      Professional;
}

