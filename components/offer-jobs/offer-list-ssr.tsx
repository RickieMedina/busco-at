'use server'

import OfferItemList from './offer-item-list';
import { mapIOfferToTypeOffer } from '@/lib/utils';
import { IOffer } from '@/lib/interfaces/offer';

export default async function OfferList() {
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offer`,{ next: { revalidate: 60 } } );
  const offers: IOffer[] = await response.json();
  const mappedOffers = mapIOfferToTypeOffer(offers);

  return (
    <div>
      {mappedOffers.map((offer) => (
        <OfferItemList
          offer={offer}
          isApplication={true}
        />
      ))}
    </div>
  );
}

