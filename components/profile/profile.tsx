'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CalendarDays, MapPin, Phone, Mail, Briefcase, User, Edit, Save, X } from 'lucide-react'
import { Users } from '@/lib/interfaces/user'
import { Professional } from '@/lib/interfaces/professional'
import {getAddressFromDB } from '@/lib/utils'
import { Employer } from '@/lib/interfaces/employer'
import AttachmentList from '../attachment/list-attachment'
import EditableAttachmentList from '../attachment/editable-attachment-list'
import { CustomAlert } from '../custom-alert'
import { Loading } from '../loading'
import { ImageUpload } from '../image-upload'
import ProfessionalRatings from './professional-ratings'

interface ProfileProps {
  user: Users;
  professional?: Professional;
  employer?: Employer;
  onClose?: () => void;
}

interface AttachmentType{
  attachment_type: number;
  name: string;
  description: string;
}

export default function Profile({ user, professional, employer, onClose }: ProfileProps) {

  const [activeTab, setActiveTab] = useState<string>("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'exito' | 'error', title: string, message: string } | null>(null)
  
  // Estados para campos editables
  const [phone, setPhone] = useState(user.phone || '')
  const [imageUrl, setImageUrl] = useState(user.image || '')
  const [companyName, setCompanyName] = useState(employer?.company_name || '')
  const [companyPhone, setCompanyPhone] = useState(employer?.phone || '')
  const [companyEmail, setCompanyEmail] = useState(employer?.email || '')
  const [socialSecurity, setSocialSecurity] = useState(professional?.social_security || false)
  const [privateWork, setPrivateWork] = useState(professional?.private || false)
  const [hourlyRate, setHourlyRate] = useState(professional?.hourly_rate?.toString() || '')
  const [observations, setObservations] = useState(professional?.observations || '')

  const getGender = (genderCode: number) => {
    switch (genderCode) {
      case 1: return 'Masculino'
      case 2: return 'Femenino'
      default: return 'Otro'
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setAlert(null)
    
    try {
      const userResponse = await fetch(`/api/user/${user.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, address: user.address, image: imageUrl })
      })

      if (!userResponse.ok) throw new Error('Error actualizando datos personales')

      if (user.role === 'profesional' && professional) {
        const profResponse = await fetch(`/api/professional/${user.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            social_security: socialSecurity,
            private: privateWork,
            hourly_rate: hourlyRate,
            observations
          })
        })
        if (!profResponse.ok) throw new Error('Error actualizando datos profesionales')
      } else if (user.role === 'empleador' && employer) {
        const empResponse = await fetch(`/api/employer/${user.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: companyName,
            phone: companyPhone,
            email: companyEmail
          })
        })
        if (!empResponse.ok) throw new Error('Error actualizando datos de empleador')
      }

      setAlert({ type: 'exito', title: 'Éxito', message: 'Perfil actualizado correctamente' })
      setIsEditing(false)
      
      // Recargar página para ver cambios
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      console.error(error)
      setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Restaurar valores originales
    setPhone(user.phone || '')
    setImageUrl(user.image || '')
    setCompanyName(employer?.company_name || '')
    setCompanyPhone(employer?.phone || '')
    setCompanyEmail(employer?.email || '')
    setSocialSecurity(professional?.social_security || false)
    setPrivateWork(professional?.private || false)
    setHourlyRate(professional?.hourly_rate?.toString() || '')
    setObservations(professional?.observations || '')
    setIsEditing(false)
    setAlert(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <ImageUpload
              currentImage={imageUrl}
              onImageUploaded={(url) => setImageUrl(url)}
              fallback={`${user.name[0]}${user.last_name[0]}`}
            />
          ) : (
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image || undefined} alt={`${user.name} ${user.last_name}`} className="object-cover" />
              <AvatarFallback>{user.name[0]}{user.last_name[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">{user.name} {user.last_name}</CardTitle>
            <p className="text-muted-foreground">{user.role === 'profesional' ? 'Profesional' : 'Empleador'}</p>
            {user.role === 'profesional' && (
              <div className="mt-2">
                <ProfessionalRatings userId={user.user_id} showDetailed={false} />
              </div>
            )}
          </div>
        </div>
        {!onClose && (
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline" disabled={loading}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading && <Loading />}
        {alert && (
          <CustomAlert
            tipo={alert.type}
            titulo={alert.title}
            mensaje={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${user.role === 'profesional' ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="role">
              {user.role === 'profesional' ? 'Información Profesional' : 'Información de Empleador'}
            </TabsTrigger>
            {user.role === 'profesional' &&(
              <TabsTrigger value="adjuntos">
                Adjuntos
              </TabsTrigger>
            )
            }
          </TabsList>
          <TabsContent value="personal" className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Email</Label>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Teléfono</Label>
                {isEditing ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                  />
                ) : (
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Dirección</Label>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 
                  {getAddressFromDB(user.address)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Fecha de Nacimiento</Label>
                <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4" />
                    {new Date(user.birth_date).toLocaleDateString()}
                </p>
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
          <TabsContent value="role" className="space-y-4 pt-2">
            {user.role === 'profesional' && professional ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Trabaja con obra social</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={socialSecurity}
                        onCheckedChange={setSocialSecurity}
                      />
                      <span>{socialSecurity ? 'Sí' : 'No'}</span>
                    </div>
                  ) : (
                    <p>{professional.social_security ? 'Sí' : 'No'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Trabaja particular</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={privateWork}
                        onCheckedChange={setPrivateWork}
                      />
                      <span>{privateWork ? 'Sí' : 'No'}</span>
                    </div>
                  ) : (
                    <p>{professional.private ? 'Sí' : 'No'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Areas de atención</Label>
                  <p className="text-sm text-muted-foreground">
                      {professional.professional_care_type
                          .map((care) => care.health_care_type.name).join(', ')} 
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tipo de Paciente</Label>
                  <p className="text-sm text-muted-foreground">
                      {professional.professional_patient
                            .map((patient) => patient.patient_type.name).join(', ')} 
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Tarifa por Hora</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="0.00"
                    />
                  ) : (
                    <p>${professional.hourly_rate}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold">Observaciones</Label>
                  {isEditing ? (
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Observaciones"
                      rows={3}
                    />
                  ) : (
                    <p>{professional.observations || 'Sin observaciones'}</p>
                  )}
                </div>
              </div>
            ) : user.role === 'empleador' && employer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">Nombre de la Empresa</Label>
                  {isEditing ? (
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  ) : (
                    <p className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {employer.company_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Teléfono de la Empresa</Label>
                  {isEditing ? (
                    <Input
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="Teléfono"
                    />
                  ) : (
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {employer.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Email de la Empresa</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="email@empresa.com"
                    />
                  ) : (
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {employer.email}</p>
                  )}
                </div>
              </div>
            ) : (
              <p>Información no disponible</p>
            )}
          </TabsContent>
          <TabsContent value="adjuntos" className="space-y-4 pt-2">
            {professional && (
              <div className="grid grid-cols-1 md:grid-cols-2">
              <EditableAttachmentList 
                attachments={professional.attachment || []} 
                professionalId={professional.professional_id}
                isEditing={isEditing}
                onAttachmentUpdated={() => window.location.reload()}
              />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='flex justify-end'>
        {onClose &&
        <Button onClick={onClose}
                type="button"
                size="lg">
                Cerrar
        </Button>
        }
        
      </CardFooter>
    </Card>
  )
}