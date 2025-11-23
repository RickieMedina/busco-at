// Interfaces para provincias y localidades
// Corresponden al schema Prisma de province y locality

export interface Province {
  province_id: number
  name: string
}

export interface Locality {
  locality_id: number
  name: string
  province_id: number | null
}
