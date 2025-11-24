export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export const offerStatusLabels = {
  [OfferStatus.ACTIVE]: 'Activa',
  [OfferStatus.COMPLETED]: 'Finalizada',
  [OfferStatus.CANCELLED]: 'Cancelada'
} as const;

export const offerStatusColors = {
  [OfferStatus.ACTIVE]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    variant: 'default' as const
  },
  [OfferStatus.COMPLETED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    variant: 'secondary' as const
  },
  [OfferStatus.CANCELLED]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    variant: 'destructive' as const
  }
} as const;
