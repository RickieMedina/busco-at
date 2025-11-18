'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"
import { provincias } from "@/lib/constants/provincias";
import { localidadesPorProvincia } from "@/lib/constants/localidades-por-provincia";

interface JobSearchFormProps {
  onSearch: (searchData: { keyword: string; provincia: string; localidad: string }) => void
}

export default function JobSearchForm({ onSearch }: JobSearchFormProps) {
  const [selectedProvincia, setSelectedProvincia] = useState<string>("cordoba")
  const [localidades, setLocalidades] = useState<string[]>([])
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>("")
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    setLocalidades(localidadesPorProvincia["cordoba"])
  }, [])

  useEffect(() => {
    setLocalidades(localidadesPorProvincia[selectedProvincia as keyof typeof localidadesPorProvincia])
    setSelectedLocalidad("") 
  }, [selectedProvincia])

  const handleSearch = () => {
    onSearch({
      keyword,
      provincia: provincias.find(p => p.id === selectedProvincia)?.nombre || "",
      localidad: selectedLocalidad
    })
  }

  return (
    <div className="w-full bg-[#f7f8ff] p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-full pl-9"
            placeholder="Palabra clave"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
            <SelectTrigger className="w-[200px] bg-background">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 opacity-50" />
                <SelectValue placeholder="Selecciona provincia" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {provincias.map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocalidad} onValueChange={setSelectedLocalidad}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Selecciona localidad" />
            </SelectTrigger>
            <SelectContent>
              {localidades.map((localidad) => (
                <SelectItem key={localidad} value={localidad}>
                  {localidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant={"default"}
          size="lg"
          onClick={handleSearch}
        >
          Buscar 
        </Button>
      </div>
    </div>
  )
}