'use client'
import TypeList from "@/components/type-table";
import { useEffect, useState } from "react";

type typeList = {
    id: number
    name: string
}

export default function HealtCarePage() {

    const [types, setTypes] = useState<typeList[]>([]);
    
    useEffect(() => {

        const fetchTypes = async () => {
            try {
                refreshTypes();
            } catch (error) {
                console.error('Error fetching healt care types:', error);
            }
        };
        fetchTypes();
    }, []);

    const refreshTypes = async () => {
        try {
            const response = await fetch('/api/healt-care-type');

            if (response.ok) {
                const updatedTypes = await response.json();

                const mappedData = updatedTypes.map((apiData: { health_care_type_id: number, name: string }) => ({
                    id: apiData.health_care_type_id,
                    name: apiData.name
                }));

                setTypes(mappedData);
            } else {
                console.error('Error refreshing healt care types');
            }
        } catch (error) {
            console.error('Error refreshing healt care types:', error);
        }
    };


    const handleEdit = async (id: number, name: string) => {
        try {
            const response = await fetch('/api/healt-care-type', {
                method: 'PUT',
                body: JSON.stringify({id: id, name: name}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok){
                const updatedHealtType = await response.json();

                const updatedType = {
                    id: updatedHealtType.health_care_type_id,
                    name: updatedHealtType.name
                }
               
                setTypes(types.map((type) => type.id === updatedType.id ? updatedType : type));
            }
            else {
                console.error('Error to updating type');
            }
            
        } catch (error) {
            console.error('Error to updating type', error);
        }
    }

    const handleAdd= async (name: string) => {

        try {
            const response = await fetch('/api/healt-care-type', {
                method: 'POST',
                body: JSON.stringify({name: name}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                const newHealtType= await response.json();

                const healtType = {
                    id: newHealtType.health_care_type_id,
                    name: newHealtType.name
                }

                setTypes([...types, healtType]);
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
            const response = await fetch('/api/healt-care-type', {
                method: 'DELETE',
                body: JSON.stringify({id: id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if(response.ok){
                const deletedHealtType = await response.json();
                
                setTypes(types.filter((type) => type.id !== deletedHealtType.health_care_type_id));
                
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
            <h1 className="text-4xl font-bold">Administración Areas de atención</h1>
            <TypeList types={types} title={"Listado de tipos de areas"} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}/>
        </div>
    )
}