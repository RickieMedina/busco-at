'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

interface ScheduleSelectorProps {
  schedule: ScheduleItem[];
  setSchedule: (newSchedule: ScheduleItem[]) => void;
}

export function ScheduleSelector({ schedule, setSchedule }: ScheduleSelectorProps) {
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedStartTime, setSelectedStartTime] = useState("")
  const [selectedEndTime, setSelectedEndTime] = useState("")

  const addSchedule = () => {
    if (selectedDay && selectedStartTime && selectedEndTime) {
      if(selectedStartTime < selectedEndTime){
        return
      }
      const newSchedule = [...schedule, { day: selectedDay, startTime: selectedStartTime, endTime: selectedEndTime }]
      setSchedule(newSchedule)
      setSelectedDay("")
      setSelectedStartTime("")
      setSelectedEndTime("")
    }
  }

  const removeSchedule = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index)
    setSchedule(newSchedule)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Horarios</h3>
      <div className="flex flex-wrap gap-2">
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccione un día" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
          className="w-[150px]"
          placeholder="Hora de entrada"
        />
        <Input
          type="time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
          className="w-[150px]"
          placeholder="Hora de salida"
        />
        <Button 
          type="button"
          onClick={addSchedule}>Agregar
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {schedule.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {item.day} {item.startTime} - {item.endTime}
            <button
              type="button"
              onClick={() => removeSchedule(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}