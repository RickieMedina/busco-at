"use client";

import TypeList from "@/components/type-table";
import { useEffect, useState } from "react";

type typeList = {
    id: number
    name: string
}

export default function PatientPage() {

    const [types, setTypes] = useState<typeList[]>([]);
    
    useEffect(() => {

        const fetchTypes = async () => {
            try {
                refreshTypes();
            } catch (error) {
                console.error('Error fetching patient types:', error);
            }
        };
        fetchTypes();
    }, []);

    const refreshTypes = async () => {
        try {
            const response = await fetch('/api/patient-type');

            if (response.ok) {
                const updatedTypes = await response.json();

                const mappedData = updatedTypes.map((apiData: { patient_type_id: number, name: string }) => ({
                    id: apiData.patient_type_id,
                    name: apiData.name
                }));

                setTypes(mappedData);
            } else {
                console.error('Error refreshing patient types');
            }
        } catch (error) {
            console.error('Error refreshing patient types:', error);
        }
    };


    const handleEdit = async (id: number, name: string) => {
        try {
            const response = await fetch('/api/patient-type', {
                method: 'PUT',
                body: JSON.stringify({id: id, name: name}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok){
                const updatedPatientType = await response.json();

                const updatedType = {
                    id: updatedPatientType.patient_type_id,
                    name: updatedPatientType.name
                }
               // refreshTypes();
                setTypes(types.map((type) => type.id === updatedType.id ? updatedType : type));
            }
            else {
                console.error('Error updating type');
            }
            
        } catch (error) {
            console.error('Error updating type', error);
        }
    }

    const handleAdd= async (name: string) => {

        try {
            const response = await fetch('/api/patient-type', {
                method: 'POST',
                body: JSON.stringify({name: name}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                const newPatientType= await response.json();

                const patientType = {
                    id: newPatientType.patient_type_id,
                    name: newPatientType.name
                }

                setTypes([...types, patientType]);
            }
            else {
                console.error('Error adding type');
            }
        }
        catch (error) {
            console.error('Error adding type');
        }
      
    }

    const handleDelete = async (id: number) => {
        
        try {
            const response = await fetch('/api/patient-type', {
                method: 'DELETE',
                body: JSON.stringify({id: id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if(response.ok){
                const deletedPatientType = await response.json();
                console.log(deletedPatientType);
                setTypes(types.filter((type) => type.id !== deletedPatientType.patient_type_id));
                //refreshTypes();
            }
            else {
                console.error('Error deleting type');
            }
            
        } catch (error) {
            console.error('Error deleting type');
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">Administración Tipos de Paciente</h1>
            <TypeList types={types} title={"Listado de tipos"} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}/>
        </div>
    )
}