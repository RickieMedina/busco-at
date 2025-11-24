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
  // Tomar solo las top 3 provincias
  const top3Provinces = data.slice(0, 3)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Provincias con Mayor Cantidad de Ofertas</CardTitle>
        <CardDescription>Top 3 provincias con más ofertas creadas</CardDescription>
      </CardHeader>
      <CardContent>
        {top3Provinces.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay ofertas creadas en este período
          </p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3Provinces.map((province, index) => (
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
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={top3Provinces} 
                  margin={{ top: 20, right: 10, left: 10, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="province" 
                    angle={0}
                    height={60}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="offers_count" 
                    fill="hsl(var(--chart-1))" 
                    name="Ofertas"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
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
