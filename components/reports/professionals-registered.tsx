"use client"

import { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DatoMensual {
  mes: string
  profesionales_registrados: number
  edad_promedio: number
}

interface ReporteProfesionalesProps {
  datos: DatoMensual[]
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function ReporteProfesionales({ datos}: ReporteProfesionalesProps) {
  const [datosFormateados, setDatosFormateados] = useState<DatoMensual[]>([])

  useEffect(() => {
    const hoy = new Date()
    const ultimosMeses = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }).reverse()

    const datosCompletos = ultimosMeses.map(mes => {
      const datoExistente = datos.find(d => d.mes === mes)
      return datoExistente || { mes, profesionales_registrados: 0, edad_promedio: 0 }
    })

    // Filtrar los meses sin datos
    const datosFiltrados = datosCompletos.filter(d => d.profesionales_registrados > 0 || d.edad_promedio > 0)

    setDatosFormateados(datosFiltrados)
  }, [datos])

  const formatearMes = (mes: string) => {
    const [year, month] = mes.split('-')
    return `${MESES[parseInt(month) - 1]} ${year.slice(2)}`
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Reporte de Profesionales Registrados</CardTitle>
        <CardDescription>Últimos meses con registros y edad promedio</CardDescription>
        <CardDescription > * Solo se mostraran los meses con registros</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer
          config={{
            profesionales: {
              label: "Profesionales Registrados",
              color: "hsl(var(--chart-1))",
            },
            edad: {
              label: "Edad Promedio",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosFormateados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tickFormatter={formatearMes} />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar yAxisId="left" dataKey="profesionales_registrados" fill="hsl(var(--chart-1))" name="Profesionales Registrados" />
              <Bar yAxisId="right" dataKey="edad_promedio" fill="hsl(var(--chart-2))" name="Edad Promedio" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}