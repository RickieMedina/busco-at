'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import  {ScheduleSelector}  from "@/components/schedule-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from 'next-auth/react'
import { Loading } from "../loading"
import { CustomAlert } from "../custom-alert"
import { gender } from "@/lib/constants/gender"
import { provincias } from "@/lib/constants/provincias"
import { localidadesPorProvincia } from "@/lib/constants/localidades-por-provincia"
import { formOfferSchema } from "@/lib/zod"
import MapLocationPicker from "../map-location-picker"


export default function JobOfferForm() {
  const [schedule, setSchedule] = useState<{ day: string; startTime: string; endTime: string }[]>([])
  const [localidades, setLocalidades] = useState<string[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const session = useSession(); 
  

  const form = useForm<z.infer<typeof formOfferSchema>>({
    resolver: zodResolver(formOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      address:{
        pais: "Argentina",
        provincia: "",
        localidad: "",
        calle: "",
        numero: "",
      },
      location: {
        latitude: 0,
        longitude:0
      },
      ageRange: { min: 18, max: 65 },
      requiresCertificate: false,
      paymentType: { socialSecurity: false, private: false },
      diagnosis: "",
      additionalObservations: "",
      schedule: [],
    },
  })

  const handleLocationConfirm = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    form.setValue("location.latitude", lat)
    form.setValue("location.longitude", lng)
  }

  async function onSubmit(values: z.infer<typeof formOfferSchema>) {
    console.log(values)
    startTransition(async () => {
      setError(null)

      const response = await fetch(`/api/offer/${session.data?.user.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error)
      } else {
        setAlerta({
          tipo: 'exito',
          titulo: '¡Tu oferta de empleo se registro con éxito!',
          mensaje: 'Puedes visualizar desde tu perfil en la sección de ofertas'
        })
      }
    })
  }

  const close = () => {
    //Aqui podemos redireccionar
    setAlerta(null)
    form.reset()
    setSchedule([])
  }

  return (
    <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Oferta de trabajo</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="md:flex  md:flex-row gap-8">
                <div className="w-1/2 space-y-2">
                  <h2 className="text-lg font-medium">Detalles de la oferta</h2>
                  <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la oferta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el título" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ingrese la descripción de su oferta" 
                                  className="resize-none"
                                  {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describa el diagnóstico"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalObservations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones adicionales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese observaciones adicionales"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <ScheduleSelector
                  schedule={schedule}
                  setSchedule={(newSchedule) => {
                    setSchedule(newSchedule)
                    form.setValue("schedule", newSchedule)
                  }}
                />
                
                </div>
                <div className="w-1/2 space-y-2">
                  <h2 className="text-lg font-medium">Lugar de trabajo</h2>
                  <FormField
                        control={form.control}
                        name="address.pais"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.provincia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                setLocalidades(localidadesPorProvincia[value as keyof typeof localidadesPorProvincia] || [])
                                form.setValue("address.localidad", "")
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione su provincia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {provincias.map((provincia) => (
                                  <SelectItem key={provincia.id} value={provincia.id}>
                                    {provincia.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.localidad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localidad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione su localidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {localidades.map((localidad) => (
                                  <SelectItem key={localidad} value={localidad}>
                                    {localidad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="address.calle"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calle</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                              <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.numero"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                <Input {...field} 
                                  inputMode="numeric"
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>
                      <div className="space-y-2 mb-8">
                        <FormLabel className="">Coordenadas de ubicación</FormLabel>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 ">
                          <FormField
                              control={form.control}
                              name="location.latitude"
                              render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                  <Input {...field} 
                                    readOnly
                                    placeholder="latitud: -34.61315"
                                    inputMode="numeric"
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                  </FormControl>
                                <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="location.longitude"
                              render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                  <Input {...field}
                                    placeholder="longitud: -58.37723" 
                                    inputMode="numeric"
                                    readOnly
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <MapLocationPicker onLocationConfirm={handleLocationConfirm} />
                        </div>
                        <FormDescription>*Esta ubicación se mostrara en el mapa que acompañara a su publicación.</FormDescription>
                      </div>
                      <div className="grid gap-2">
                        <h2 className="text-lg font-medium mt-2">Detalles adicionales</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <FormField
                                  control={form.control}
                                  name="gender"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Género</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione su género" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {gender.map((gender) => (
                                            <SelectItem key={gender.gender_id} value={gender.name}>
                                              {gender.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                          />
                          <FormItem>
                            <FormLabel>Rango de edad</FormLabel>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="Mín"
                                {...form.register("ageRange.min", { valueAsNumber: true })}
                                className="w-20"
                              />
                              <span>a</span>
                              <Input
                                type="number"
                                placeholder="Máx"
                                {...form.register("ageRange.max", { valueAsNumber: true })}
                                className="w-20"
                              />
                            </div>
                          </FormItem>
                        </div>
                      </div>
                <div>

                </div>
                <FormField
                  control={form.control}
                  name="requiresCertificate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Requiere certificado</FormLabel>
                        <FormDescription>
                          Activar si la oferta requiere certificado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                <FormLabel>Tipo de pago</FormLabel>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="paymentType.socialSecurity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Obra social</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentType.private"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <FormLabel className="text-base">Particular</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {error && <FormMessage>{error}</FormMessage>}
                </div>
                </div>
              </div>
             
              <div className="flex justify-end space-x-4">
                {/* <Button type="button" variant="outline" onClick={() => { Lógica para redirigir al dashboard }}>
                  Cancelar
                </Button> */}
                <Button type="submit"
                     disabled={isPending}
                    >Registrar oferta</Button>
              </div>
            </form>
          </Form>
          {alerta && (
            <CustomAlert
              tipo={alerta.tipo}
              titulo={alerta.titulo}
              mensaje={alerta.mensaje}
              onClose={close}
            />
          )}
          {isPending && <Loading fullScreen text="Procesando tu registro de oferta..." />}
        </CardContent>
    </Card>
   
  )
}