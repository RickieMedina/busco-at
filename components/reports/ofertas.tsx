"use client"

import { useState, useEffect } from 'react'
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DatoMensual {
  mes: number
  anio: number
  offers_count: number
  applications_count: number
  applications_accepted: number
}

interface ReporteProps {
  datos: DatoMensual[]
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function TendenciaReporte({ datos }: ReporteProps) {
  const [datosFormateados, setDatosFormateados] = useState<DatoMensual[]>([])
  const [totales, setTotales] = useState({ ofertas: 0, postulaciones: 0, aceptadas: 0 })

  useEffect(() => {
    const datosOrdenados = [...datos].sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio
      return a.mes - b.mes
    })

    setDatosFormateados(datosOrdenados)

    const totales = datosOrdenados.reduce((acc, dato) => ({
      ofertas: acc.ofertas + dato.offers_count,
      postulaciones: acc.postulaciones + dato.applications_count,
      aceptadas: acc.aceptadas + dato.applications_accepted
    }), { ofertas: 0, postulaciones: 0, aceptadas: 0 })

    setTotales(totales)
  }, [datos])

  const formatearMes = (mes: number, anio: number) => `${MESES[mes - 1]} ${anio}`

  return (
    <Card className="w-full max-w-2xl mt-6">
      <CardHeader>
        <CardTitle>Tendencias de Ofertas y Postulaciones</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent >
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Ofertas</p>
            <p className="text-2xl font-bold">{totales.ofertas}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Postulaciones</p>
            <p className="text-2xl font-bold">{totales.postulaciones}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Postulaciones Aceptadas</p>
            <p className="text-2xl font-bold">{totales.aceptadas}</p>
          </div>
        </div>
        <ChartContainer
          config={{
            offers: {
              label: "Ofertas",
              color: "hsl(var(--chart-1))",
            },
            applications: {
              label: "Aplicaciones",
              color: "hsl(var(--chart-2))",
            },
            accepted: {
              label: "Aceptadas",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosFormateados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tickFormatter={(mes, index) => formatearMes(mes, datosFormateados[index].anio)} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="offers_count" stroke="hsl(var(--chart-1))" name="Ofertas" />
              <Line type="monotone" dataKey="applications_count" stroke="hsl(var(--chart-2))" name="Aplicaciones" />
              <Line type="monotone" dataKey="applications_accepted" stroke="hsl(var(--chart-3))" name="Aceptadas" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}