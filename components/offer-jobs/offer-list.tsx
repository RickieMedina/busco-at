
'use client'

import { map } from "leaflet";
import OfferItemList from "./offer-item-list";
import { Offer } from '../../types/offer';
import { useSession } from "next-auth/react";

interface OfferListProps {
    offers: Offer[];
    isApplication?: boolean;
}

export default  function OfferList({offers, isApplication}: OfferListProps) {
    const session = useSession();
    
    // Si isApplication no se pasa como prop, determinarlo automáticamente basado en el rol
    const shouldShowApplication = isApplication !== undefined 
        ? isApplication 
        : session.data?.user.role === 'profesional';
    
return (
        <div>
            {offers.map((offer) => (
                    <OfferItemList offer={offer}
                                   isApplication={shouldShowApplication}
                    >
                    </OfferItemList>
            ))}
        </div>
 )
}
