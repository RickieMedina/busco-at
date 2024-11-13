"use client"
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { fetchHealthCareTypes } from '@/lib/constants/healt-care-type'
import { fetchPatientTypes } from '@/lib/constants/patient-type'

interface HealthCareType {
  health_care_type_id: number
  name: string | null
}

interface PatientType {
  patient_type_id: number
  name: string | null
}

interface FilterComponentProps {
  onSearch: (careTypeId: number | null, patientTypeId: number | null) => void
  isLoading?: boolean
}

export default function FilterComponent( {onSearch , isLoading}: FilterComponentProps) {
  const [selectedCareType, setSelectedCareType] = useState<string | null>(null)
  const [selectedPatientType, setSelectedPatientType] = useState<string | null>(null)
  const [healthCareTypes, setHealthCareTypes] = useState<HealthCareType[]>([])
  const [patientTypes, setPatientTypes] = useState<PatientType[]>([])

  const handleSearch = () => {
    const careTypeId = selectedCareType ? parseInt(selectedCareType) : null
    const patientTypeId = selectedPatientType ? parseInt(selectedPatientType) : null
    onSearch(careTypeId, patientTypeId)
  }

  useEffect(() => {
    const fetchData = async () => {
        const healthCareData = await fetchHealthCareTypes();
        const patientData = await fetchPatientTypes();
        setHealthCareTypes(healthCareData);
        setPatientTypes(patientData);
      };

    fetchData();
  }, [])

  return (
    <div className="flex items-center space-x-4 mb-4">
      <Select onValueChange={setSelectedCareType}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Área de atención" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las áreas</SelectItem>
          {healthCareTypes.map((type) => (
            <SelectItem key={type.health_care_type_id} value={type.health_care_type_id.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setSelectedPatientType}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Tipo de paciente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los pacientes</SelectItem>
          {patientTypes.map((type) => (
            <SelectItem key={type.patient_type_id} value={type.patient_type_id.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button 
         variant="default"
         size={'default'}
         disabled={isLoading}
         onClick={handleSearch}>Aplicar filtro
         </Button>
    </div>
  )
}