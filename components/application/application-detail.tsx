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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { XCircle, InfoIcon } from "lucide-react"
import { OfferStatus, offerStatusLabels, offerStatusColors } from "@/lib/constants/offer-status"
import { useSession } from "next-auth/react"
import { CustomAlert } from "../custom-alert"
import { Loading } from "../loading"


interface ApplicationListProps {
  //offer_id: number
  offers: Offer[]
}

export default function ApplicationList({  offers }: ApplicationListProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [offer_id, setOfferId] = useState<number>(0)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
  const session = useSession()

  const fetchApplications = async () => {
    if (!offer_id) return
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
    const offer = offers.find(o => o.id === offerId)
    setSelectedOffer(offer || null)
  }
  
  const handleScored = () => {
    console.log('scored')
    fetchApplications()
  }

  const handleCancelOffer = async () => {
    if (!offer_id || !session.data?.user.user_id) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/offer/${session.data.user.user_id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_offer_id: offer_id })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const result = await response.json()
      
      setAlert({
        tipo: 'exito',
        titulo: '¡Oferta cancelada!',
        mensaje: `La oferta fue cancelada exitosamente. ${result.notified_count} postulante(s) fueron notificados.`
      })
      
      // Actualizar el estado de la oferta seleccionada
      if (selectedOffer) {
        setSelectedOffer({ ...selectedOffer, status: OfferStatus.CANCELLED })
      }
      
      // Recargar postulaciones
      await fetchApplications()
      
    } catch (error: any) {
      setAlert({
        tipo: 'error',
        titulo: 'Error al cancelar',
        mensaje: error.message || 'No se pudo cancelar la oferta'
      })
    } finally {
      setIsLoading(false)
      setShowCancelDialog(false)
    }
  }

  const pendingApplicationsCount = applications.filter(app => app.application_status === 'pendiente').length
  const isOfferActive = selectedOffer?.status === OfferStatus.ACTIVE
  const offerStatusConfig = selectedOffer?.status ? offerStatusColors[selectedOffer.status] : null
  const offerStatusLabel = selectedOffer?.status ? offerStatusLabels[selectedOffer.status] : null

  


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gestionar Postulaciones</CardTitle>
        <CardDescription >
          Revise y gestione las postulaciones para esta oferta
        </CardDescription>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-4">
          <div className="flex-1 w-full">
            <JobOfferSelector
              offers={offers}
              onSelectedOffer={(offerId) => handleSelectedOffer(offerId)}
            />
          </div>
          
          {selectedOffer && isOfferActive && (
            <Button 
              variant="destructive" 
              onClick={() => setShowCancelDialog(true)}
              className="w-full md:w-auto">
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar Oferta
            </Button>
          )}
        </div>

        {selectedOffer && offerStatusConfig && (
          <div className="mt-4">
            <Badge variant={offerStatusConfig.variant} className={`${offerStatusConfig.bg} ${offerStatusConfig.text}`}>
              Estado: {offerStatusLabel}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedOffer && !isOfferActive && (
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Esta oferta está {offerStatusLabel?.toLowerCase()}. No se pueden gestionar postulaciones.
            </AlertDescription>
          </Alert>
        )}
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
                  { isOfferActive && app.application_status === 'pendiente' && (
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
                  {!isOfferActive && app.application_status === 'pendiente' && (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog de confirmación para cancelar oferta */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>Esta acción:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Cancelará la oferta <strong>"{selectedOffer?.title}"</strong></li>
                  <li>Notificará a <strong>{pendingApplicationsCount}</strong> postulante(s) pendiente(s)</li>
                  <li><strong>No se puede deshacer</strong></li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener activa</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOffer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, cancelar oferta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alerta de éxito/error */}
      {alert && (
        <CustomAlert
          tipo={alert.tipo}
          titulo={alert.titulo}
          mensaje={alert.mensaje}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Loading */}
      {isLoading && <Loading fullScreen text="Cancelando oferta..." />}
    </Card>
  )
}

