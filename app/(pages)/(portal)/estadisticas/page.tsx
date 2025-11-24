'use client'

import { useEffect, useState } from "react"
import MonthFilter from "@/components/reports/month-filter"
import TopUsers from "@/components/reports/top-users"
import HourlyRate from "@/components/reports/hourly-rate"
import ProvincesChart from "@/components/reports/provinces-chart"

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

interface HourlyRateData {
  average: number
  count: number
  month: number
  year: number
}

interface ProvinceData {
  province: string
  offers_count: number
}

interface StatisticsData {
  top_users: TopUser[]
  hourly_rate: HourlyRateData
  provinces: ProvinceData[]
  period: {
    month: number
    year: number
  }
}

export default function StatisticsPage() {
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/statistics?year=${selectedYear}&month=${selectedMonth}`
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [selectedYear, selectedMonth])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Estadísticas de la Plataforma</h1>
        <p className="text-muted-foreground">
          Visualiza las métricas y estadísticas más relevantes
        </p>
      </div>

      <MonthFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <TopUsers data={data.top_users} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HourlyRate data={data.hourly_rate} />
            <ProvincesChart data={data.provinces} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
        </div>
      )}
    </div>
  )
}
