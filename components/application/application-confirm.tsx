'use client'

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Status } from "@prisma/client";
import { CustomAlert } from "../custom-alert";
import { Loading } from "../loading";

interface ConfirmDialogProps {
    onConfirm: () => void;
    id: number;
  }
  
export default function ConfirmApplication({ id, onConfirm } : ConfirmDialogProps){

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    const status: Status = 'aceptada';
    
const handleConfirm = async () => {

    setIsConfirmVisible(false);
    startTransition(async () => {

        const response = await fetch(`/api/application/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({application_status: status})
        });

        if (!response.ok) {
            const data = await response.json()
            setAlerta({
                tipo: 'error',
                titulo: '¡Error al aceptar la postulación, reintente nuevamente!',
                mensaje: data.error
            })
            return
        }
        else{
            setAlerta({
                tipo: 'exito',
                titulo: '¡Postulación aceptada!',
                mensaje: 'La postulación fue aceptada exitosamente'
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
         <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsConfirmVisible(true)}
          >
            Aceptar
          </Button>
          {isConfirmVisible && (
            <Dialog open={isConfirmVisible} onOpenChange={setIsConfirmVisible}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Confirmación</DialogTitle>
                    <DialogDescription>¿Está seguro que desea aceptar esta postulación?</DialogDescription>
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