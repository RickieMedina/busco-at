'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Clock, FileText, User, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchRatingTypes } from '@/lib/constants/rating-type'
import { RatingType } from '@/types/rating'
import { useSession } from 'next-auth/react'


interface RatingComponentProps {
    application_id: number;
    profesional_id: number;
    onsubmit: () => void;
}

type AlertType = {
  tipo: 'success' | 'error';
  titulo: string;
  mensaje: string;
}

export default function RatingComponent({application_id,profesional_id,onsubmit}: RatingComponentProps) {
  const session = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [ratings, setRatings] = useState<{ [key: number]: number }>({})
  const [isRated, setIsRated] = useState(false)
  const [ratingTypes, setRatingTypes] = useState<RatingType[]>([])
  const [alert, setAlert] = useState<AlertType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    const fetchData = async () => {
        const ratingTypes = await fetchRatingTypes();
        setRatingTypes(ratingTypes);
      };

    const fetchRating = async () => {
        const response = await fetch(`/api/rating/${application_id}`)
        const rating = await response.json()
        console.log('rating',rating)
        if(rating.length >0){
        setIsRated(true)
        }
      }
  
      fetchRating();
      fetchData();
  }, [])

  

  const handleRating = (ratingTypeId: number, value: number) => {
    setRatings(prev => ({ ...prev, [ratingTypeId]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    const response = await fetch('/api/rating', {
        method: 'POST',
        body: JSON.stringify({
            ratings: ratings,
            application_id: application_id,
            professional_id: profesional_id,
            user_id: session.data?.user.user_id
            }
        )
    })

    if(!response.ok) {
        setIsLoading(false)
        setAlert({ tipo: 'error', titulo: 'Error', mensaje: 'Ocurrió un error al enviar la valoración' })
        return
    }
    else{
        setIsLoading(false)
        setIsOpen(false)
        setRatings({})
        setAlert({ tipo: 'success', titulo: 'Éxito', mensaje: 'Valoración enviada correctamente' })
        onsubmit();
    }

  }


  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'rapidez en primer contacto':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'documentación actualizada':
        return <FileText className="w-5 h-5 text-green-500" />
      case 'perfil actualizado':
        return <User className="w-5 h-5 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <div>
        <Button variant="outline" 
                size="sm" 
                disabled={isRated}
                onClick={() => setIsOpen(true)}>
            Valorar Profesional
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Valoración del Profesional</DialogTitle>
              <DialogDescription>Por favor, califique los siguientes aspectos del profesional</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {ratingTypes.map((type) => (
                <div key={type.rating_type_id} className="flex items-center space-x-2">
                  {getIcon(type.name)}
                  <span className="flex-grow">{type.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{type.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          (ratings[type.rating_type_id] || 0) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(type.rating_type_id, star)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsOpen(false)} variant="outline">Cancelar</Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Valoración'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {alert && (
          <Alert className={`mt-4 ${alert.tipo === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'}`}>
            <AlertTitle>{alert.titulo}</AlertTitle>
            <AlertDescription>{alert.mensaje}</AlertDescription>
          </Alert>
        )}
      </div>
    </TooltipProvider>
  )
}