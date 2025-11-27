'use client'

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useState } from "react";
import { Offer } from "@/types/offer";
import OfferItemApplication from "./application-offer";
import ApplicationRemove from "./application-remove";
import { offerStatusLabels } from "@/lib/constants/offer-status";
import { Badge } from "../ui/badge";



interface ApplicationUser {
    application_id: number;
    professional_id: number;
    job_offer_id: number;
    application_date: string;
    application_status: string;
    notified_date: string | null;
    job_offer: Offer;
  }
  
  interface ApplicationTableProps {
    userId: string;
    applications: ApplicationUser[];
    //onViewDetails: (jobOfferId: number) => void;
  }


export function ApplicationUser({ applications, userId}: ApplicationTableProps) {
    const [pagination, setPagination] = useState({ pageIndex: 0,pageSize: 10,})
  
    const columns: ColumnDef<ApplicationUser>[] = [
      {accessorKey: 'job_offer.title',header: 'Oferta',},
      {accessorKey: 'job_offer.createdAt',header: 'Fecha de Oferta', cell: ({ row }) => { const createdAt = row.original.job_offer.createdAt; 
                                                                                         return createdAt ? formatDate(createdAt.toString()) : '';},},
      {accessorKey: 'job_offer.status', header: 'Estado Oferta', cell: ({ row }) => {
        const status = row.original.job_offer.status;
        return <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
          {offerStatusLabels[status as keyof typeof offerStatusLabels] || status}
        </Badge>
      }},
      {accessorKey: 'application_date',header: 'Fecha de Postulación', cell: ({ row }) => formatDate(row.original.application_date),},
      {accessorKey: 'application_status',header: 'Estado Postulación',},      
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }: any) => (
          <div className="flex space-x-1">
            <OfferItemApplication
              offer={row.original.job_offer}
            />
            <ApplicationRemove 
              applicationId={row.original.application_id}  
              userId= {userId}
              disabled={row.original.application_status !== 'pendiente'}
              onConfirm={handleRemoveApplication}
            />
        
          </div>
        ),
      }
    ]

    const handleRemoveApplication = async()=>{
        window.location.reload();
    }

    const formatDate = (dateString: string) => {
      const [year, month, day] = dateString.split("T")[0].split("-");
      // Formatea a dd-mm-yyyy
      return `${day}-${month}-${year}`;
    }


    const table = useReactTable({
      data: applications,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination,
      },
    })

    return (
        <div className="rounded-md border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Mis postulaciones</h2>
          </div>
          <div>
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
        </div>
      );
 };