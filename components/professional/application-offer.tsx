'use client'

import { useState} from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import { Briefcase ,CheckCircleIcon, Clock, CreditCard, FileText, MapPin,  User } from "lucide-react";
import { Label } from "../ui/label";
import { gender } from "@/lib/constants/gender";
import { Offer } from "@/types/offer";

import Map from "@/components/map";


interface OfferItemListProps {
    onViewOffer?: (id: number) => void;
    offer: Offer;
}

export default function OfferItemApplication(props: OfferItemListProps) {
  const [showOfertaDetails, setShowOfertaDetails] = useState(false);

return (
    <div>
        <div>
              <Dialog open={showOfertaDetails} 
                      onOpenChange={setShowOfertaDetails}>
                <DialogTrigger asChild>
                  <Button variant="outline"
                           size={"sm"}
                        >Ver detalle oferta</Button>
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
                          <p className="text-xl">{props.offer.address.localidad} - {props.offer.address.localidad}</p>
                          <p className="text-xl">{props.offer.address.calle} {props.offer.address.numero}</p>
                        </div>
                      </div>
                      <div className="flex items-start w-3/4">
                          <Map
                            latitud={props.offer.location.latitude}
                            longitud={props.offer.location.longitude}
                            mapHeight={200}
                          />
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
                  <div>
                  <DialogFooter>
                      <Button type="button"
                              size="lg"
                              onClick={() => setShowOfertaDetails(false)}>Cerrar
                       </Button>
                  </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
        </div>
    </div>
 );
}