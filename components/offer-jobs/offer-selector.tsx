'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Offer } from '@/types/offer'



interface OfferSelectorProps {
    offers: Offer[]
    onSelectedOffer: (offerId: number) => void
}

export default function JobOfferSelector( {onSelectedOffer, offers}: OfferSelectorProps) {

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

    const handleSelectOffer = (value: string) => {
        setSelectedOfferId(parseInt(value));
        onSelectedOffer(parseInt(value));
    }

  return (
    <div className="space-y-4">
      <Select onValueChange={handleSelectOffer} value={selectedOfferId?.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione una oferta" />
        </SelectTrigger>
        <SelectContent>
          {offers.map((offer) => (
            <SelectItem key={offer.id} value ={offer.id!.toString()}>
              {offer.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}