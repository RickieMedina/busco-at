'use server'

import OfferItemList from './offer-item-list';
import { mapIOfferToTypeOffer } from '@/lib/utils';
import { IOffer } from '@/lib/interfaces/offer';

export default async function OfferList() {
  
  const response = await fetch(`http://localhost:3000/api/offer`,{ next: { revalidate: 60 } } );
  const offers: IOffer[] = await response.json();
  const mappedOffers = mapIOfferToTypeOffer(offers);

  return (
    <div>
      {mappedOffers.map((offer) => (
        <OfferItemList
          offer={offer}
        />
      ))}
    </div>
  );
}

