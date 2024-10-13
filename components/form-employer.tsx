'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from './ui/form'
import { signOut, useSession } from 'next-auth/react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CustomAlert } from './custom-alert'
import { Loading } from './loading'

const formSchema = z.object({
    companyName: z.string().min(1, 'El nombre de empleador es requerido'),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    identification_type: z.string().min(1, 'Seleccione tipo de identificación'),
    identification_number: z.string().regex(/^(20|23|24|27|30|33|34)([0-9]{9}|-[0-9]{8}-[0-9])$/, 'CUIL/CUIT inválido'),
    email: z.string().email('Correo electrónico inválido').optional()
})

type FormValues = z.infer<typeof formSchema>

const identification_type=[
    {
        "identification_id": 2,
        "name": "CUIT"
    },
    {
        "identification_id": 4,
        "name": "CUIL"
    }
]


export default function FormularioEmployer() {

    const session = useSession();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    const router = useRouter();
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
       
        startTransition(async () => {
            setError(null)
            const response = await fetch(`/api/employer/${session.data?.user.user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            
            if (!response.ok) {
                const data = await response.json()
                setError(data.error)
                return
            }
            else{
                setAlerta({
                    tipo: 'exito',
                    titulo: '¡Perfil de empleador completo!',
                    mensaje: 'Gracias por completar tu perfil. Ingresa las credenciales nuevamente para ver tu perfil completo'
                })
            }
        });
    }

    const closeAndRedirect = () => {
        signOut({callbackUrl: '/login'})
        setAlerta(null)
    }

  return (
    <Card className="w-full max-w-2xl">
        <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-2xl font-bold">Registro de Empleador</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre de empleador</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Teléfono de empleador</FormLabel>
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
               <FormField
                    control={form.control}
                    name="identification_type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo identificación</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {identification_type.map((type) => (
                                <SelectItem key={type.identification_id} value={type.name}>
                                {type.name}
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
                    name="identification_number"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Número de identificación</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Empleador (opcional)</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="micorreo@ejemplo.com"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" 
                        className="w-full"
                        disabled={isPending}>
                    Finalizar
                </Button>
                {error && <FormMessage> {error}</FormMessage>}
                </form>
            </Form>
        </CardContent>
        {alerta && (
        <CustomAlert
          tipo={alerta.tipo}
          titulo={alerta.titulo}
          mensaje={alerta.mensaje}
          onClose={closeAndRedirect}
        />
      )}
      {isPending && <Loading fullScreen text="Procesando tu registro..." />}
    </Card>
  )
}
