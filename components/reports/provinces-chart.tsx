"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ProvinceData {
  province: string
  offers_count: number
}

interface ProvincesChartProps {
  data: ProvinceData[]
}

export default function ProvincesChart({ data }: ProvincesChartProps) {
  // Tomar solo las top 10 provincias
  const top10Provinces = data.slice(0, 10)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provincias con Mayor Cantidad de Ofertas</CardTitle>
        <CardDescription>Top 10 provincias con más ofertas creadas</CardDescription>
      </CardHeader>
      <CardContent>
        {top10Provinces.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay ofertas creadas en este período
          </p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {top10Provinces.slice(0, 3).map((province, index) => (
                <div key={province.province} className="p-4 rounded-lg border bg-card">
                  <p className="text-sm font-medium text-muted-foreground">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {province.province}
                  </p>
                  <p className="text-2xl font-bold">{province.offers_count}</p>
                  <p className="text-xs text-muted-foreground">ofertas</p>
                </div>
              ))}
            </div>

            <ChartContainer
              config={{
                offers: {
                  label: "Ofertas",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={top10Provinces} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="province" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="offers_count" 
                    fill="hsl(var(--chart-1))" 
                    name="Ofertas"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}
