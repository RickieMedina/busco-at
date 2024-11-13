'use client'

import { Check, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { use, useEffect, useState, useTransition } from "react";
import { v4 as uuidv4 } from 'uuid';


interface ApplicationPaymentProps {

    id: number;
}

export default  function ApplicationPayment( {id}: ApplicationPaymentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [applicationId, setApplicationId] = useState(0)
  const [isPending, startTransition] = useTransition();
  const [isPayment, setIsPayment] = useState(false)


  useEffect(() => {

     const fecthDonationStatus = async () => {
        const response = await fetch(`/api/payment/${id}`)
        const donations = await response.json()
       
        if(donations > 0){
          setIsPayment(true)
        }
      }

     fecthDonationStatus()
  }, [])

  const handleDonate = async () => {

        if(amount <= 0) {
          return
        }
        startTransition(async () => {
        const paymentId = uuidv4();
        
        const response = await fetch(`/api/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { postId: `${paymentId}-${applicationId}`,
              applicationId: applicationId, 
              amount: amount 
            })
        });
    
        if (!response.ok) {
          const data = await response.json()
          console.log(data.error)
          return
        }
        const data = await response.json()
        window.location.href = data.preference_init_point; 
        setIsModalOpen(false)
    
        })
      }
    
   return (
   
    <div className="flex-2 m-2">
            <Button variant="outline" 
                    size="sm" 
                    disabled={isPayment}
                    className="w-full"
                    onClick={() => {setIsModalOpen(true);setApplicationId(id)}}>
                <DollarSign className=" h-3 w-3 text-gray-500" /> 
                {isPayment? 'Aporte realizado':'Agregar aporte'}
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                <Check className="h-6 w-6 text-green-500" />
                Conexión exitosa
                </DialogTitle>
                <DialogDescription>
                Colabora con nuestra misión de conectar profesionales con oportunidades laborales
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    value={amount}
                    onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    if (value === '' || (/^\d*\.?\d*$/.test(value) && !isNaN(Number(value)))) {
                        setAmount(Number(value));
                    }
                    }}
                    placeholder="Importe a ingresar"
                    className="pl-9"
                    type="text"
                    min="0"
                    step="0.01"
                />
                </div>
                <DialogDescription className="text-sm">Al presionar aceptar seras redirigido a la pagina de Mercado Pago</DialogDescription>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isPending}>
                Cancelar
                </Button>
                <Button onClick={handleDonate} disabled={isPending}>
                Aceptar
                </Button>
            </DialogFooter>
            </DialogContent>
            </Dialog>
    </div>
    );
} 