'use client'

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Status } from "@prisma/client";
import { CustomAlert } from "../custom-alert";
import { Loading } from "../loading";
import { Trash2 } from "lucide-react";

interface ConfirmDialogProps {
    onConfirm: () => void;
    applicationId: number;
    userId:string;
    disabled: boolean
  }
  
export default function ApplicationRemove({ applicationId, userId, disabled,onConfirm } : ConfirmDialogProps){

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    const status: Status = 'aceptada';
    
const handleConfirm = async () => {

    setIsConfirmVisible(false);
    startTransition(async () => {

        const response = await fetch(`/api/application/user/${userId}`, {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    applicationId: applicationId
                })
        });

        if (!response.ok) {
            const data = await response.json()
            setAlerta({
                tipo: 'error',
                titulo: '¡Error al remover la postulación, reintente nuevamente!',
                mensaje: data.error
            })
            return
        }
        else{
            setAlerta({
                tipo: 'exito',
                titulo: '¡Postulación eliminada con exito!',
                mensaje: 'La postulación fue eliminada de la oferta'
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
    console.log('cancel');
}

return (
     <div>
          <Button variant="outline" 
                    disabled={disabled}
                    size="icon"
                    onClick={() => setIsConfirmVisible(true)}>
                    <Trash2 className="h-4 w-4" />
            </Button>
          {isConfirmVisible && (
            <Dialog open={isConfirmVisible} onOpenChange={setIsConfirmVisible}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Confirmación</DialogTitle>
                    <DialogDescription>¿Está seguro que desea quitar su postulación de esta oferta?</DialogDescription>
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
            {isPending && <Loading fullScreen text="Procesando solicitud..." />}
     </div>
    )
};