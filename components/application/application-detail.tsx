'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Application } from "@/lib/interfaces/application"
import ProfileViewerWrapper from "../profile/profile-view-wrapper"
import ConfirmApplication from "./application-confirm"
import RejectedApplication from "./application-rejected"
import { useEffect, useState, useTransition } from "react"
import { Offer } from "@/types/offer"
import JobOfferSelector from "../offer-jobs/offer-selector"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DialogDescription } from "@radix-ui/react-dialog"
import { v4 as uuidv4 } from 'uuid';
import { Check, DollarSign } from "lucide-react"
import { start } from "repl"
import RatingComponent from "../offer-jobs/offer-score"


interface ApplicationListProps {
  //offer_id: number
  offers: Offer[]
}

export default function ApplicationList({  offers }: ApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [offer_id, setOfferId] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [applicationId, setApplicationId] = useState(0)
  const [isPending, startTransition] = useTransition();

  const fetchApplications = async () => {
    const response = await fetch(`/api/application/offers/${offer_id}`)
    const applications = await response.json()
    setApplications(applications)
  }

  useEffect(() => {
    fetchApplications()
  }, [offer_id])

  const handleUpdate = () => {
    fetchApplications()
  }

  const handleSelectedOffer = (offerId: number) => {
    setOfferId(offerId)
   // fetchApplications()
  }
  const handleScored = () => {
    console.log('scored')
    fetchApplications()
  }

  const handleDonate = async () => {
    startTransition(async () => {
    const paymentId = uuidv4();
    
    const response = await fetch(`/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { postId: paymentId,
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
    window.open(data.preference_init_point, '_blank')
    setIsModalOpen(false)

  })
  }


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gestionar Postulaciones</CardTitle>
        <CardDescription >
          Revise y gestione las postulaciones para esta oferta
        </CardDescription>
        <div className="w-full md:w-1/2">
          <JobOfferSelector
            offers={offers}
            onSelectedOffer={(offerId) => handleSelectedOffer(offerId)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profesional</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Valor Hora</TableHead>
              <TableHead>Fecha Postulación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay postulaciones
                  </TableCell>
                </TableRow>
              )
            }
            {applications.map((app) => (
              <TableRow key={app.application_id}>
                <TableCell>{app.professional?.users.name} {app.professional?.users.last_name}</TableCell>
                <TableCell> <ProfileViewerWrapper professional={app.professional!} /></TableCell>
                <TableCell>${app.professional?.hourly_rate.toLocaleString()}</TableCell>
                <TableCell>{new Date(app.application_date).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{app.application_status}</TableCell>
                <TableCell>
                  { app.application_status === 'pendiente' && (
                      <div className="flex space-x-2">
                      <ConfirmApplication
                          onConfirm={handleUpdate}
                          id= {app.application_id}
                          job_offer_id={app.job_offer_id}
                      />
                      <RejectedApplication
                          onConfirm={handleUpdate}
                          id= {app.application_id}
                          job_offer_id={app.job_offer_id}
                      />
                      </div>
                    )
                  }
                  {
                    app.application_status === 'aceptada' && (
                      <div className="flex space-x-2">
                            <RatingComponent
                             application_id={app.application_id}
                             profesional_id={app.professional_id}
                             onsubmit={handleScored}
                            />
                      </div>
                    )
                  }   
                    
                  
                  {/* <div className="flex space-x-2">
                    <button onClick={() => {setIsModalOpen(true);setApplicationId(app.application_id)}}>
                      Donación
                    </button>
                  </div> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conexión exitosa</DialogTitle>
            <DialogDescription>Si encontraste al AT que buscabas</DialogDescription>
          </DialogHeader>
          <Input
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Importe a ingresar"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleDonate()}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
      </Dialog> */}
      </CardContent>
    </Card>
  )
}

