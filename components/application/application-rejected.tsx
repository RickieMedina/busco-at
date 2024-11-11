'use client'

import { useState, useTransition } from "react";
import { Status } from "@prisma/client";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { CustomAlert } from "../custom-alert";
import { Loading } from "../loading";

interface RejectedDialogProps {
    onConfirm: () => void;
    id: number;
    job_offer_id: number;
  }

  //TODO: refactor this component with the ConfirmApplication component
export default function RejectedApplication({ id, job_offer_id, onConfirm } : RejectedDialogProps){

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    const status: Status = 'rechazada';

    
const handleConfirm = async () => {

    setIsConfirmVisible(false);
    startTransition(async () => {

        const response = await fetch(`/api/application/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                 application_status: status,
                 job_offer_id: job_offer_id
                })
        });

        if (!response.ok) {
            const data = await response.json()
            setAlerta({
                tipo: 'error',
                titulo: '¡Error al rechazar la postulación, reintente nuevamente!',
                mensaje: data.error
            })
            return
        }
        else{
            setAlerta({
                tipo: 'exito',
                titulo: '¡Postulación rechazada!',
                mensaje: 'La postulación fue rechazada exitosamente'
            })
            onConfirm();
        }
    
    })
}

const onClose = () => {
    setAlerta(null);
}

const onCancel = () => {
    setIsConfirmVisible(false);
}

return (
    <div>
        <Button 
           variant="destructive"
           size="sm"
           onClick={() => setIsConfirmVisible(true)}
         >
           Rechazar
         </Button>
         {isConfirmVisible && (
           <Dialog open={isConfirmVisible} onOpenChange={setIsConfirmVisible}>
               <DialogContent>
                   <DialogHeader>
                   <DialogTitle>Confirmación</DialogTitle>
                   <DialogDescription>¿Está seguro que desea rechazar esta postulación?</DialogDescription>
                   </DialogHeader>
                   <DialogFooter>
                   <Button onClick={onCancel} variant="outline">Cancelar</Button>
                   <Button onClick={handleConfirm}>Confirmar</Button>
                   </DialogFooter>
               </DialogContent>
           </Dialog>
          )}
          {alerta && (
                 <CustomAlert
                     tipo={alerta.tipo}
                     titulo={alerta.titulo}
                     mensaje={alerta.mensaje}
                     onClose={onClose}
                   />
                 )}
           {isPending && <Loading fullScreen text="Procesando postulación..." />}
    </div>
   )
};