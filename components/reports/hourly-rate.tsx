"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users } from "lucide-react"

interface HourlyRateData {
  average: number
  count: number
  month: number
  year: number
}

interface HourlyRateProps {
  data: HourlyRateData
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function HourlyRate({ data }: HourlyRateProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Promedio Valor Hora</CardTitle>
        <CardDescription>
          Profesionales registrados en {MESES[data.month - 1]} {data.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Valor Promedio por Hora</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ${data.average.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground">ARS</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white dark:text-green-950" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profesionales considerados</p>
                <p className="text-2xl font-bold">{data.count}</p>
              </div>
            </div>
          </div>

          {data.count === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No hay profesionales con valor hora cargado en este período
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
