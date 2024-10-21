'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import { Briefcase, BriefcaseIcon, Check, CheckCircleIcon, Clock, ClockIcon, CreditCard, CreditCardIcon, FileText, FileTextIcon, MapPin, MapPinIcon, User, UserIcon } from "lucide-react";
import { Label } from "../ui/label";
import { calculateDaysAgo } from "@/utils/calculate-days-ago";
import { gender } from "@/lib/constants/gender";
import { Offer } from "@/types/offer";


interface OfferItemListProps {
    onViewOffer?: (id: number) => void;
    offer: Offer;
}

export default function OfferItemList(props: OfferItemListProps) {
  const [showOfertaDetails, setShowOfertaDetails] = useState(false);

  //TODO: impement get address  with full location
  const getLocation = (address: Offer['address']) => {
      return `${address.calle} ${address.numero}`
  }

  const onViewOffer = (id: number) => {
      console.log('view offer item', id);
      //props.onViewOffer(id);
  }

return (
    <div>
        <div className="space-y-4 m-2">
        <Card>
            <CardContent>
            <h3 className="text-lg font-semibold">{props.offer.title}</h3>
            <p className="text-sm text-gray-500">{getLocation(props.offer.address)}</p>
            <p className="text-sm text-gray-500">{calculateDaysAgo(props.offer.createdAt!)}</p>
            </CardContent>
            <CardFooter>
              <Dialog open={showOfertaDetails} 
                      onOpenChange={setShowOfertaDetails}>
                <DialogTrigger asChild>
                  <Button variant="outline">Ver detalles de la oferta</Button>
                </DialogTrigger>
                <DialogContent className="max-w-full sm:max-w-[90vw] h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{props.offer.title.toUpperCase()}</DialogTitle>
                    <DialogDescription>
                      Información completa sobre la oferta de trabajo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 gap-2 p-6">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                        <div>
                          <Label className="text-lg font-semibold">Descripción de la oferta</Label>
                          <p className="text-xl">{props.offer.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6 text-green-500" />
                        <div>
                          <Label className="text-lg font-semibold">Diagnóstico</Label>
                          <p className="text-xl">{props.offer.diagnosis}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <FileText className="w-6 h-6 text-purple-500 mt-1" />
                        <div>
                          <Label className="text-lg font-semibold">Observaciones</Label>
                          <p className="text-xl">{props.offer.additionalObservations}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Clock className="w-6 h-6 text-yellow-500 mt-1" />
                        <div>
                          <Label className="text-lg font-semibold">Horarios</Label>
                          {props.offer.schedule.map((dayhour)=>{
                            return <p className="text-xl">{dayhour.day} {dayhour.startTime} - {dayhour.endTime}</p>
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-6 h-6 text-red-500 mt-1" />
                        <div>
                          <Label className="text-lg font-semibold">Ubicación</Label>
                          <p className="text-xl">Argentina, Córdoba</p>
                          <p className="text-xl">{props.offer.address.calle} {props.offer.address.numero}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <User className="w-6 h-6 text-indigo-500" />
                        <div>
                          <Label className="text-lg font-semibold">Género y edad requeridos</Label>
                          <p className="text-xl">
                             {gender.find(g =>  g.gender_id === props.offer.gender)?.name} 
                             , de {props.offer.ageRange.min} a {props.offer.ageRange.max} años
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6 text-orange-500" />
                        <div className="flex items-center space-x-2">
                          <Label className="text-lg font-semibold">Requiere certificado</Label>
                          {props.offer.requiresCertificate? <CheckCircleIcon className="w-6 h-6 text-green-500"/> : 
                          <>
                            <CheckCircleIcon className="w-6 h-6 text-red-500"/>
                          </>
                          }
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-6 h-6 text-teal-500" />
                        <div>
                          <Label className="text-lg font-semibold">Tipo de pago</Label>
                          {
                              props.offer.paymentType.socialSecurity && props.offer.paymentType.private ? (
                                <p className="text-xl">Combinado entre Obra social y privado</p>
                              ) : props.offer.paymentType.socialSecurity ? (
                                <p className="text-xl">Pago por obra social</p>
                              ) : props.offer.paymentType.private ? (
                                <p className="text-xl">Pago particular</p>
                              ) : (
                                <p className="text-xl">Sin información de pago</p>
                              )
                            }
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={() => setShowOfertaDetails(false)}>Cerrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            {/* <Button variant="outline"
                onClick={() => {onViewOffer(props.offer.id!)}}
                >Ver detalle</Button> */}
            </CardFooter>
        </Card>
    </div>
    </div>
 );
}