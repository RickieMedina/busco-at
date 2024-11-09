'use client'
import {  useRef, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Loading } from '../loading'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Download, Printer, Trash2 } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import * as XLSX from 'xlsx'

interface TableProps {
  users: User[]
  isPending: boolean
  onDelete: (userId: string) => void
}

// Define the User type
type User = {
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

export function UserTable({ users, isPending, onDelete }: TableProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0,pageSize: 10,})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [idUserSelected, setIdUserSelected ] = useState<string>('')

  const columns: ColumnDef<User>[] = [
    {accessorKey: 'name',header: 'Nombre',},
    {accessorKey: 'last_name',header: 'Apellido',},
    { accessorKey: 'email',header: 'Email',},
    {accessorKey: 'phone',header: 'Teléfono',},
    {accessorKey: 'role',header: 'Rol',},
    {accessorKey: 'profile_completed',header: 'Perfil Completo',cell: ({ row }) => (row.getValue('profile_completed') ? 'Sí' : 'No'),},
    {accessorKey: 'created_at',header: 'Creado',cell: ({ row }) => formatDate(row.getValue('created_at')),},
    {accessorKey: 'updated_at',header: 'Actualizado',cell: ({ row }) => formatDate(row.getValue('updated_at')),},
    {accessorKey: 'is_active',header: 'Activo',cell: ({ row }) => (row.getValue('is_active') ? 'Sí' : 'No'),},
    {id: 'actions',cell: ({ row }) => {const user = row.original
                  return (
                    <Button 
                          variant="outline" 
                          disabled={!user.is_active}
                          size="icon" onClick={() => {
                          setIdUserSelected(user.user_id)
                          setIsDeleteDialogOpen(true)
                      }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
        )
      },
    },
  ]
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })


  const onClose= () => {
      setIsDeleteDialogOpen(false)
  }

  const tableRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    documentTitle: 'Tabla de Usuarios',
    contentRef: tableRef,
    onAfterPrint: () => console.log('Printed!'),
    pageStyle: `
    @page {
      size: landscape;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 8px;
        border: 1px solid black;
        word-wrap: break-word;
        text-align: left;
      }
    }
  `,
    
  })

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.table_to_sheet(tableRef.current)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios")
    XLSX.writeFile(workbook, "usuarios.xlsx")
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Lista de Usuarios</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handlePrint()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Exportar a Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div ref={tableRef}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que desea desactivar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
               Esto cancelará todas las postulaciones u ofertas asociadas a este usuario
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={(e)=> {onDelete(idUserSelected); onClose()}}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isPending && <Loading fullScreen text="Procesando solicitud..." />}
    </div>
  )
}