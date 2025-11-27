'use client'

import { useEffect, useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface RatingType {
  type_id: number
  type_name: string
  average: number
  count: number
}

interface ProfessionalRatingsData {
  hasRatings: boolean
  totalRatings: number
  averageScore: number
  ratingsByType: RatingType[]
}

interface ProfessionalRatingsProps {
  userId: string
  showDetailed?: boolean
}

export default function ProfessionalRatings({ userId, showDetailed = true }: ProfessionalRatingsProps) {
  const [ratingsData, setRatingsData] = useState<ProfessionalRatingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/professional/${userId}/ratings`)
        
        if (!response.ok) {
          throw new Error('Error al obtener calificaciones')
        }
        
        const data = await response.json()
        setRatingsData(data)
      } catch (err) {
        console.error('Error fetching ratings:', err)
        setError('No se pudieron cargar las calificaciones')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRatings()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Cargando calificaciones...</span>
      </div>
    )
  }

  if (error || !ratingsData) {
    return null
  }

  if (!ratingsData.hasRatings) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Star className="h-4 w-4" />
        <span>Sin calificaciones aún</span>
      </div>
    )
  }

  // Componente compacto con tooltip
  const CompactRating = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-lg">{ratingsData.averageScore.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({ratingsData.totalRatings} {ratingsData.totalRatings === 1 ? 'valoración' : 'valoraciones'})
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-3">
          <div className="space-y-2">
            <p className="font-semibold text-sm mb-2">Desglose por categoría:</p>
            {ratingsData.ratingsByType.map((rating) => (
              <div key={rating.type_id} className="flex items-center justify-between gap-4 text-sm">
                <span>{rating.type_name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating.average.toFixed(1)}</span>
                  <span className="text-muted-foreground text-xs">({rating.count})</span>
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  // Componente detallado
  const DetailedRating = () => (
    <div className="space-y-3">
      {/* Promedio general */}
      <div className="flex items-center gap-2">
        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        <span className="font-bold text-2xl">{ratingsData.averageScore.toFixed(1)}</span>
        <span className="text-muted-foreground">
          ({ratingsData.totalRatings} {ratingsData.totalRatings === 1 ? 'valoración' : 'valoraciones'})
        </span>
      </div>

      {/* Desglose por tipo */}
      <div className="flex flex-wrap gap-2">
        {ratingsData.ratingsByType.map((rating) => (
          <Badge 
            key={rating.type_id} 
            variant="secondary" 
            className="flex items-center gap-1 px-3 py-1"
          >
            <span>{rating.type_name}:</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.average.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs">({rating.count})</span>
          </Badge>
        ))}
      </div>
    </div>
  )

  return showDetailed ? <DetailedRating /> : <CompactRating />
}
