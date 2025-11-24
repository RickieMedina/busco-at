"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface RatingType {
  type_id: number
  type_name: string
  average: number
}

interface TopUser {
  user_id: string
  name: string
  last_name: string
  email: string
  image: string | null
  ratings_by_type: RatingType[]
  overall_average: number
}

interface TopUsersProps {
  data: TopUser[]
}

export default function TopUsers({ data }: TopUsersProps) {
  const getInitials = (name: string, lastName: string) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-500"
      case 1: return "bg-gray-400"
      case 2: return "bg-amber-600"
      default: return "bg-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 5 Profesionales Mejor Calificados</CardTitle>
        <CardDescription>Usuarios con mayor puntuación promedio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay calificaciones disponibles para este período
          </p>
        ) : (
          data.map((user, index) => (
            <div
              key={user.user_id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              {/* Posición */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${getMedalColor(index)} flex items-center justify-center text-white font-bold text-lg`}>
                  {index + 1}
                </div>
              </div>

              {/* Avatar y datos del usuario */}
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image || undefined} alt={`${user.name} ${user.last_name}`} />
                  <AvatarFallback>{getInitials(user.name, user.last_name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {user.name} {user.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Puntuaciones */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{user.overall_average.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 justify-end">
                  {user.ratings_by_type.map((rating) => (
                    <Badge key={rating.type_id} variant="secondary" className="text-xs">
                      {rating.type_name}: {rating.average.toFixed(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
