'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'

type Type = {
  id: number
  name: string
}

type TypeListProps = {
  types: Type[]
  title?: string
  onAdd: (name: string) => void
  onEdit: (id: number, name: string) => void
  onDelete: (id: number) => void
}
//TODO: add validate input for newTypeName and editingType
export default function TypeList({ types, title, onAdd, onEdit, onDelete }: TypeListProps) {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [editingType, setEditingType] = useState<Type | null>(null)
  const [deletingTypeId, setDeletingTypeId] = useState<number | null>(null)

  const handleAdd = async() => {
    onAdd(newTypeName)
    setNewTypeName('')
    setIsAddModalOpen(false)
  }

  const handleEdit = async () => {
    if (editingType) {
      onEdit(editingType.id, editingType.name)
      setIsEditModalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (deletingTypeId !== null) {
      console.log(deletingTypeId);
      onDelete(deletingTypeId)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title ? title : 'Listado de Tipos'}</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Tipo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {types.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">No hay tipos registrados</TableCell>
            </TableRow>
          )}
          {types.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" className="mr-2" onClick={() => {
                  setEditingType(type)
                  setIsEditModalOpen(true)
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => {
                  setDeletingTypeId(type.id)
                  setIsDeleteDialogOpen(true)
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Tipo</DialogTitle>
          </DialogHeader>
          <Input
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Nombre del nuevo tipo"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tipo</DialogTitle>
          </DialogHeader>
          <Input
            value={editingType?.name || ''}
            onChange={(e) => setEditingType(prev => prev ? {...prev, name: e.target.value} : null)}
            placeholder="Nombre del tipo"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo seleccionado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}