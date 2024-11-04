'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

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
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');


  const handleDeactivateUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => 
      user.user_id === userId ? { ...user, is_active: false } : user
    ))
  }, [])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

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

  const handleStateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateFilter(event.target.value);
  };

  /* const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesGlobal = Object.values(user).some(value => 
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
      const matchesDateRange = dateRange.from && dateRange.to
        ? new Date(user.created_at) >= dateRange.from && new Date(user.created_at) <= dateRange.to
        : true
      const matchesActive = activeFilter === undefined
        ? true
        : user.is_active === (activeFilter === 'true')
      const matchesRole = roleFilter
        ? user.role.toLowerCase() === roleFilter.toLowerCase()
        : true

      return matchesGlobal && matchesDateRange && matchesActive && matchesRole
    })
  }, [users, globalFilter, dateRange, activeFilter, roleFilter])
 */
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
         {/*  <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Seleccionar rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover> */}
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Perfil Completo</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.profile_completed ? 'Sí' : 'No'}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.updated_at)}</TableCell>
                <TableCell>{user.is_active ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeactivateUser(user.user_id)}
                        disabled={!user.is_active}
                      >
                        Dar de baja
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}