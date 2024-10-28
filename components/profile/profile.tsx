'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Phone, Mail, Briefcase, User, X } from 'lucide-react'
import { Users } from '@/lib/interfaces/user'
import { Professional } from '@/lib/interfaces/professional'

interface Employer {
  employer_id: number;
  company_name: string;
  phone: string;
  email: string;
}

interface ProfileProps {
  user: Users;
  professional?: Professional;
  employer?: Employer;
  onClose: () => void;
}

export default function Profile({ user, professional, employer, onClose }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<string>("personal")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGender = (genderCode: number) => {
    switch (genderCode) {
      case 1: return 'Masculino'
      case 2: return 'Femenino'
      default: return 'Otro'
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.image || '/placeholder.svg?height=96&width=96'} alt={`${user.name} ${user.last_name}`} />
          <AvatarFallback>{user.name[0]}{user.last_name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl">{user.name} {user.last_name}</CardTitle>
          <p className="text-muted-foreground">{user.role === 'profesional' ? 'Profesional' : 'Empleador'}</p>
        </div>
       
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="role">
              {user.role === 'profesional' ? 'Información Profesional' : 'Información de Empleador'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Email</Label>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Teléfono</Label>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Dirección</Label>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {user.address}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Fecha de Nacimiento</Label>
                {/* <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {user.birth_date.toDateString()}</p> */}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Género</Label>
                <p className="flex items-center gap-2"><User className="w-4 h-4" /> {getGender(user.gender)}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Identificación</Label>
                <p>{user.identification_type === 1 ? 'DNI' : 'Otro'}: {user.identification_number}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="role" className="space-y-4">
            {user.role === 'profesional' && professional ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Seguridad Social</Label>
                  <p>{professional.social_security ? 'Sí' : 'No'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Privado</Label>
                  <p>{professional.private ? 'Sí' : 'No'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tipo de Cuidado de Salud</Label>
                  <p>{professional.health_care_type}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tipo de Paciente</Label>
                  <p>{professional.patient_type}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tarifa por Hora</Label>
                  <p>${professional.hourly_rate}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Observaciones</Label>
                  <p>{professional.observations || 'Sin observaciones'}</p>
                </div>
              </div>
            ) : user.role === 'empleador' && employer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Nombre de la Empresa</Label>
                  <p className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {employer.company_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Teléfono de la Empresa</Label>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {employer.phone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Email de la Empresa</Label>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {employer.email}</p>
                </div>
              </div>
            ) : (
              <p>Información no disponible</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button onClick={onClose}
                type="button"
                size="lg">
            Cerrar
        </Button>
      </CardFooter>
    </Card>
  )
}