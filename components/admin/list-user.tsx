'use client'

import { useState,useMemo, useTransition } from 'react'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CustomAlert } from '../custom-alert'
import { UserTable } from './list-paginated'

interface User {
  user_id: string
  name: string
  last_name: string
  email: string
  phone: string
  role: string
  profile_completed: boolean
  created_at: string
  updated_at: string
  is_active: boolean
}

export default function ListUser({ initialUsers = [] }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [globalFilter, setGlobalFilter] = useState('')
  //const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [alerta, setAlerta] = useState<{ tipo: 'exito' | 'error', titulo: string, mensaje: string } | null>(null)
//   const handleDeactivateUser = useCallback((userId: string) => {
//     setUsers(prev => prev.map(user => 
//       user.user_id === userId ? { ...user, is_active: false } : user
//     ))
//   }, [])



  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesGlobal = globalFilter === '' || 
        (user.name && user.name.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(globalFilter.toLowerCase()));

      const matchesActiveFilter = stateFilter === 'all' || stateFilter === ''
        ? true
        : stateFilter === 'true'
          ? user.is_active === true
          : user.is_active === false || user.is_active === null;
  
      const matchesRoleFilter = roleFilter === 'all' || roleFilter === ''
        ? true
        : user.role.toLowerCase() === roleFilter.toLowerCase();
  
      return matchesGlobal && matchesActiveFilter && matchesRoleFilter ;
    });
  }, [users, stateFilter, roleFilter, globalFilter]);

//   const handleStateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setStateFilter(event.target.value);
//   };

  const handleDelete = async (userId: string) => {
    if (!userId) {
        return;
    }
    startTransition(async () => {
        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({status: false}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if(!response.ok){
                setAlerta({
                    tipo: 'error',
                    titulo: '¡Ocurrió un error!',
                    mensaje: 'No se pudo realizar la solicitud'
                  })
            }
            else {
                const result = await response.json();
                setAlerta({
                    tipo: 'exito',
                    titulo: '¡La solicitud se realizo con éxito!',
                    mensaje: 'Puedes continuar gestionando'
                })
                window.location.reload();
            }
            
        } catch (error) {
            setAlerta({
                tipo: 'error',
                titulo: '¡Ocurrió un error!',
                mensaje: 'No se pudo realizar la solicitud'
              })
            console.error('Error deleting user');
        }
    });
  } 

  const closeAlert = () => {
    setAlerta(null)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Usuarios</h1>
      <div className="mb-4 space-y-4">
        <Input
          placeholder="Buscar por nombre, apellido o email"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-4">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
            </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="profesional">Profesional</SelectItem>
              <SelectItem value="empleador">Empleador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
       <UserTable 
                 users={filteredUsers} 
                 onDelete={(handleDelete)}
                 isPending={isPending}
        />
        {alerta && (
            <CustomAlert
              tipo={alerta.tipo}
              titulo={alerta.titulo}
              mensaje={alerta.mensaje}
              onClose={closeAlert}
            />
          )}
       
      </div>
    </div>
  )
}