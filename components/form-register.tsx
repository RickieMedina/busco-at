"use client"

import { useState, useTransition } from "react"
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

const provincias = [
  { id: "buenosaires", nombre: "Buenos Aires" },
  { id: "cordoba", nombre: "Córdoba" },
  { id: "santafe", nombre: "Santa Fe" },
]

const gender=[
    {
        "gender_id": 1,
        "name": "Masculino"
    },
    {
        "gender_id": 2,
        "name": "Femenino"
    },
    {
        "gender_id": 3,
        "name": "Otro"
    }
]

const localidadesPorProvincia = {
  buenosaires: ["La Plata", "Mar del Plata", "Bahía Blanca"],
  cordoba: ["Córdoba", "Villa María", "Río Cuarto"],
  santafe: ["Rosario", "Santa Fe", "Rafaela"],
}

const rol =[
    "profesional",
    "empleador"
]

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  dni: z.string()
  .min(8, "El DNI debe tener 8 dígitos")
  .max(8, "El DNI debe tener 8 dígitos")
  .refine((val) => /^\d+$/.test(val), {
    message: "El DNI debe contener solo números",
  }),
  fecha: z.string().refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura")
    .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, "Debes ser mayor de 18 años para registrarte"),
  genero: z.string().min(1, "Seleccione un género"),
  telefono: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  pais: z.literal("Argentina"),
  provincia: z.string().min(1, "Seleccione una provincia"),
  localidad: z.string().min(1, "Seleccione una localidad"),
  calle: z.string().min(1, "Ingrese el nombre de la calle"),
  numero: z.string().min(1, "Ingrese el número de la calle"),
//   imagenPerfil: z
//     .any()
//     .refine((files) => files?.length == 1, "La imagen es requerida")
//     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
//     .refine(
//       (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//       "Solo se aceptan archivos .jpg, .jpeg, .png y .webp"
//     ),
  rol: z.string().min(1, "Selecione un rol"),
})

type FormValues = z.infer<typeof formSchema>

export default function RegisterForm() {
    
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [localidades, setLocalidades] = useState<string[]>([])
    const router = useRouter();
    
    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        pais: "Argentina",
    },
    })

//   const onSubmit = (values: FormValues) => {
//     console.log(values)
//     // Aquí iría la lógica para enviar los datos al servidor
//   }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    startTransition(async () => {

    const response = await registerAction(values);

    if(response.error) {
        console.log(response.error);
        setError(response.error);
        return;
    }
    else{
        router.push("/dashboard");
    }
    });
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
                name="pais"
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
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setLocalidades(localidadesPorProvincia[value as keyof typeof localidadesPorProvincia] || [])
                        form.setValue("localidad", "")
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
                name="localidad"
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
                    name="calle"
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
                    name="numero"
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
                      disabled={isPending}>
                Registrarse
              </Button>
              {error && <FormMessage> {error}</FormMessage>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}