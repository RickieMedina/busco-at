'use client'

import FilterComponent from "@/components/reports/filter";
import TendenciaReporte from "@/components/reports/ofertas";
import ReporteProfesionales from "@/components/reports/professionals-registered";
import { use, useEffect, useState } from "react";


interface DataOffer {
    mes: number
    anio: number
    offers_count: number
    applications_count: number
    applications_accepted: number
  }
  
  interface DatoPofessional {
    mes: string
    profesionales_registrados: number
    edad_promedio: number
  }

  interface filterProfessional{
    careTypeId: number | null
    patientTypeId : number | null
  }

export default function ReportsPage() {
    const [dataOffer,  setDataOffer] = useState<DataOffer[]>([])
    const [dataProfessional, setDataProfessional] = useState<DatoPofessional[]>([])
    const[filterProfessional, setFilterProfessional] = useState<filterProfessional>({careTypeId:null, patientTypeId:null})
 

    useEffect( () => {

        const fetchDataProfessional = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/professional?careTypeId=${filterProfessional.careTypeId}&patientTypeId=${filterProfessional.patientTypeId}`);
            const data = await response.json();
            setDataProfessional(data);
            console.log('data', data)
        }

        const fetchDataOffer = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/offer`);
            const data = await response.json();
            setDataOffer(data);
        }
     fetchDataProfessional();
      fetchDataOffer();

    }, [filterProfessional])

    const handleSearch = (careTypeId: any, patientTypeId: any) => {

        if(careTypeId === 'all') careTypeId = null
        if(patientTypeId === 'all') patientTypeId = null

        console.log(careTypeId, patientTypeId)

        setFilterProfessional({careTypeId, patientTypeId})
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Mis estadisticas</h1>
            <div className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col w-full md:w-1/2 m-4">
                <FilterComponent onSearch={handleSearch} />
                <ReporteProfesionales datos={dataProfessional} />
                </div>

                <div className="flex flex-col w-full md:w-1/2 m-4">
                <TendenciaReporte datos={dataOffer} />
                </div>
            </div>
        </div>
           
    )

}
