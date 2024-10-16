'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'
import { FileUpload } from './file-upload'


const formSchema = z.object({
    identification_type: z.string().min(1, 'Seleccione tipo de identificación'),
    identification_number: z.string().regex(/^(20|23|24|27|30|33|34)([0-9]{9}|-[0-9]{8}-[0-9])$/, 'CUIL/CUIT inválido'),
    health_care_type: z.string().min(1, 'El campo de atención es requerido'),
    patient_type: z.string().min(1, 'El tipo de paciente es requerido'),
    social_security: z.boolean().default(false),
    private: z.boolean().default(false),
    hourly_rate: z.string().min(1, 'El valor hora es requerido'),
    url: z.string().min(1, 'El archivo es requerido').optional(),
    observations: z.string().max(250, 'Las observaciones no pueden superar los 250 caracteres').optional()
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


const patient_type=[
    {
        "patient_type_id": 18,
        "name": "Adultos"
    },
    {
        "patient_type_id": 19,
        "name": "Adultos mayores"
    },
    {
        "patient_type_id": 20,
        "name": "Niñez y adolescencia"
    }
]


const health_care_type=[
    {
        "health_care_type_id": 5,
        "name": "Salud mental"
    },
    {
        "health_care_type_id": 4,
        "name": "Discapacidad"
    }
]



export default function FormularioProfessional() {

    const session = useSession();
    const [error, setError] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('values',values)
        startTransition(async () => {
            setError(null)
            const response = await fetch(`/api/professional/${session.data?.user.user_id}`, {
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
                    titulo: '¡Perfil de profesional completo!',
                    mensaje: 'Gracias por completar tu perfil. Ingresa las credenciales nuevamente para ver tu perfil completo'
                })
            }
        });
    }

    const closeAndRedirect = () => {
        signOut({callbackUrl: '/login'})
        setAlerta(null)
    }

    const onfileUploaded = (url: string) => {
        setFileUrl(url);
        form.setValue("url", url);
        console.log('file uploaded');
    }
  return (
    <Card className="w-full max-w-2xl">
        <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-2xl font-bold">Datos de profesional</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <h2><strong>Especialización</strong></h2>   
                 <FormField
                    control={form.control}
                    name="health_care_type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Campo de atención</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {health_care_type.map((type) => (
                                <SelectItem key={type.health_care_type_id} value={type.name}>
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
                    name="patient_type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de paciente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {patient_type.map((type) => (
                                <SelectItem key={type.patient_type_id} value={type.name}>
                                {type.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <h2><strong>Detalles de contratación</strong></h2>
                 <div className='flex flex-col md:flex-row md:gap-6 md:w-auto'>
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
                 </div>
                 <FormField
                    control={form.control}
                    name="social_security"
                    render={({ field }) => (
                    <FormItem className="flex md:flex-row md:w-auto  items-center  gap-4">
                        <FormLabel>Trabaja con obra social</FormLabel>
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
                    name="private"
                    render={({ field }) => (
                    <FormItem  className="flex md:flex-row md:w-auto  items-center  gap-4">
                        <FormLabel>Trabaja con particular</FormLabel>
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
                    name="hourly_rate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor hora a la fecha</FormLabel>
                        <FormControl>
                        <Input {...field} 
                          placeholder="ejemplo: 200"
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
                    name="observations"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                        <Textarea {...field}
                                placeholder="Quiero que en mi contratación se considere además.."/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                /> 
                <h2><strong>Adjuntos</strong></h2>
                <FileUpload 
                    label="Curriculum vitae"
                    allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
                    onFileUploaded={onfileUploaded}
                    maxSizeInBytes={5000000}
                 />
                <Button type="submit" 
                        className="w-full"
                        disabled={isPending}
                        >
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

