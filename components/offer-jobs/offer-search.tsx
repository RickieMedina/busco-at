'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Search, X } from "lucide-react"
import { Province, Locality } from "@/lib/interfaces/location"

interface JobSearchFormProps {
  onSearch: (searchData: { keyword: string; provincia: string; localidad: string }) => void
}

export default function JobSearchForm({ onSearch }: JobSearchFormProps) {
  const [provincias, setProvincias] = useState<Province[]>([])
  const [selectedProvincia, setSelectedProvincia] = useState<string>("")
  const [localidades, setLocalidades] = useState<Locality[]>([])
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>("")
  const [keyword, setKeyword] = useState("")
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false)

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoadingProvinces(true)
        const response = await fetch('/api/province')
        const data = await response.json()
        setProvincias(data)
        
        // Seleccionar Córdoba por defecto (ID 14)
        const cordoba = data.find((p: Province) => p.name === 'Córdoba')
        if (cordoba) {
          setSelectedProvincia(cordoba.province_id.toString())
        }
      } catch (error) {
        console.error('Error cargando provincias:', error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }
    
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (!selectedProvincia) return
    
    const fetchLocalities = async () => {
      try {
        setIsLoadingLocalities(true)
        setSelectedLocalidad("")
        const response = await fetch(`/api/locality?province_id=${selectedProvincia}`)
        const data = await response.json()
        setLocalidades(data)
      } catch (error) {
        console.error('Error cargando localidades:', error)
      } finally {
        setIsLoadingLocalities(false)
      }
    }
    
    fetchLocalities()
  }, [selectedProvincia])

  const handleSearch = () => {
    const selectedProvinciaName = provincias.find(
      p => p.province_id.toString() === selectedProvincia
    )?.name || ""
    
    const selectedLocalidadName = localidades.find(
      l => l.locality_id.toString() === selectedLocalidad
    )?.name || ""
    
    onSearch({
      keyword,
      provincia: selectedProvinciaName,
      localidad: selectedLocalidadName
    })
  }

  const handleClear = () => {
    setKeyword("")
    
    // Resetear a Córdoba
    const cordoba = provincias.find(p => p.name === 'Córdoba')
    if (cordoba) {
      setSelectedProvincia(cordoba.province_id.toString())
    }
    setSelectedLocalidad("")
    
    onSearch({
      keyword: "",
      provincia: "",
      localidad: ""
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
              {isLoadingProvinces ? (
                <SelectItem value="loading" disabled>Cargando...</SelectItem>
              ) : (
                provincias.map((provincia) => (
                  <SelectItem key={provincia.province_id} value={provincia.province_id.toString()}>
                    {provincia.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select value={selectedLocalidad} onValueChange={setSelectedLocalidad} disabled={!selectedProvincia || isLoadingLocalities}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Selecciona localidad" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingLocalities ? (
                <SelectItem value="loading" disabled>Cargando...</SelectItem>
              ) : localidades.length === 0 ? (
                <SelectItem value="empty" disabled>No hay localidades</SelectItem>
              ) : (
                localidades.map((localidad) => (
                  <SelectItem key={localidad.locality_id} value={localidad.locality_id.toString()}>
                    {localidad.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant={"default"}
          size="lg"
          onClick={handleSearch}
          title="Buscar ofertas"
        >
          Buscar 
        </Button>
        
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="Limpiar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}