"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { registerAction } from "@/actions/auth-action"
import { useRouter } from "next/navigation"
import { gender } from "@/lib/constants/gender"
import { formRegisterSchema } from "@/lib/zod"
import MapLocationPicker from "./map-location-picker"
import { Loading } from "./loading"
import { CustomAlert } from "./custom-alert"
import { TermsCheckbox } from "./user/check-tyc"
import { Province, Locality } from "@/lib/interfaces/location"

const rol =[
    "profesional",
    "empleador"
]
//TODO: Mover estas constantes a un archivo de configuración
const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

type FormValues = z.infer<typeof formRegisterSchema>

export default function RegisterForm() {
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    const [error, setError] = useState<string | null>(null);  
    const [isPending, startTransition] = useTransition();
    const [provincias, setProvincias] = useState<Province[]>([])
    const [localidades, setLocalidades] = useState<Locality[]>([])
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const router = useRouter();
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
    const [isLoadingLocalities, setIsLoadingLocalities] = useState(false)
    
    const form = useForm<FormValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
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
    },
    })

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoadingProvinces(true)
        const response = await fetch('/api/province')
        const data = await response.json()
        setProvincias(data)
      } catch (error) {
        console.error('Error cargando provincias:', error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }
    
    fetchProvinces()
  }, [])

  async function onSubmit(values: z.infer<typeof formRegisterSchema>) {
    
    startTransition(async () => {

    const response = await registerAction(values);

    if(response.error) {
        console.log(response.error);
        setError(response.error);
        return;
    }
    else{
        setAlerta({
          tipo: 'exito',
          titulo: '¡Se registro con éxito!',
          mensaje: 'Ya eres usuario, completa tu perfil para poder usar todos los servicios.'
        })
    }
    });
}

const close = () => {
  setAlerta(null)
  form.reset()
  router.push("/dashboard");
}

const handleLocationConfirm = (lat: number, lng: number) => {
  setLocation({ lat, lng })
  form.setValue("location.latitude", lat)
  form.setValue("location.longitude", lng)
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta Nueva</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                control={form.control}
                name="genero"
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
                <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                        <Input {...field} 
                          placeholder="ejemplo: 3510011553"
                          inputMode="numeric"
                          maxLength={10}
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
                      onValueChange={async (value) => {
                      
                        const selectedProvince = provincias.find(p => p.province_id.toString() === value)
                        if (selectedProvince) {
                          field.onChange(selectedProvince.name)
                          
                          try {
                            setIsLoadingLocalities(true)
                            const response = await fetch(`/api/locality?province_id=${value}`)
                            const data = await response.json()
                            setLocalidades(data)
                          } catch (error) {
                            console.error('Error cargando localidades:', error)
                          } finally {
                            setIsLoadingLocalities(false)
                          }
                          
                          form.setValue("address.localidad", "")
                        }
                      }}
                      value={provincias.find(p => p.name === field.value)?.province_id.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su provincia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingProvinces ? (
                          <SelectItem value="loading" disabled>Cargando...</SelectItem>
                        ) : (
                          provincias.map((provincia) => (
                            <SelectItem key={provincia.province_id} value={provincia.province_id.toString()}>
                              {provincia.name}
                            </SelectItem>
                          ))
                        )}
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
                    <Select 
                      onValueChange={(value) => {
                        // Buscar el nombre de la localidad por ID
                        const selectedLocality = localidades.find(l => l.locality_id.toString() === value)
                        if (selectedLocality) {
                          field.onChange(selectedLocality.name)
                        }
                      }}
                      value={localidades.find(l => l.name === field.value)?.locality_id.toString()}
                      disabled={isLoadingLocalities || localidades.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su localidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingLocalities ? (
                          <SelectItem value="loading" disabled>Cargando...</SelectItem>
                        ) : localidades.length === 0 ? (
                          <SelectItem value="empty" disabled>Seleccione primero una provincia</SelectItem>
                        ) : (
                          localidades.map((localidad) => (
                            <SelectItem key={localidad.locality_id} value={localidad.locality_id.toString()}>
                              {localidad.name}
                            </SelectItem>
                          ))
                        )}
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="location.latitude"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Latitud</FormLabel>
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
                        <FormLabel>Longitud</FormLabel>
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
              <FormDescription>*Esta ubicación se mostrara con sus datos personales.</FormDescription>
            
              {/* <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="imagenPerfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen de perfil</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormDescription>
                      Seleccione una imagen de perfil (máximo 5MB, formatos: jpg, jpeg, png, webp)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div> */}
              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de perfil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su tipo de perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rol.map((rol) => (
                          <SelectItem key={rol} value={rol}>
                            {rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" 
                      className="w-full"
                      disabled={isPending || !termsAccepted}>
                Registrarse
              </Button>
              {error && <FormMessage> {error}</FormMessage>}
            </form>
            <TermsCheckbox onCheckedChange={setTermsAccepted} />
          </Form>
        </CardContent>
        {alerta && 
            <CustomAlert
              tipo={alerta.tipo}
              titulo={alerta.titulo}
              mensaje={alerta.mensaje}
              onClose={close}
            />
         }
        {isPending && <Loading fullScreen text="Procesando su registro..." />}
      </Card>
    </div>
  )
}