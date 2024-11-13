'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Application } from "@/lib/interfaces/application"
import ProfileViewerWrapper from "../profile/profile-view-wrapper"
import ConfirmApplication from "./application-confirm"
import RejectedApplication from "./application-rejected"
import { useEffect, useState} from "react"
import { Offer } from "@/types/offer"
import JobOfferSelector from "../offer-jobs/offer-selector"
import RatingComponent from "../offer-jobs/offer-score"
import ApplicationPayment from "./application-payment"


interface ApplicationListProps {
  //offer_id: number
  offers: Offer[]
}

export default function ApplicationList({  offers }: ApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [offer_id, setOfferId] = useState<number>(0)
  

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
                      <>
                          <div className="flex-2">
                                <RatingComponent
                                application_id={app.application_id}
                                profesional_id={app.professional_id}
                                onsubmit={handleScored}
                                />
                          </div>
                          <ApplicationPayment
                            id={app.application_id}
                          />
                      </>
                    )
                  }   
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      
      </CardContent>
    </Card>
  )
}

