 'use client'
import { map } from "leaflet";
import OfferItemList from "./offer-item-list";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Offer } from '../../types/offer';
import { mapIOfferToTypeOffer } from "@/lib/utils";


export default  function OfferList() {
    const session = useSession();
    const [offers, setOffers] = useState<Offer[]>([]);

    const onViewOffer = (id: number) => {
        console.log('view offer list', id);
    }
    
    useEffect(() => {
        const fetchOffers = async () => {
            console.log('fetching offers id:', session.data?.user.user_id);
            const response = await fetch(`/api/offer/${session.data?.user.user_id}`);
            const offers = await response.json();
            const offersModel = mapIOfferToTypeOffer(offers);
            setOffers(offersModel);
        }
        fetchOffers();
    }, []);
    
return (
        <div>
            {offers.map((offer) => (
                    <OfferItemList offer={offer}
                                   onViewOffer={(id) => onViewOffer(id)}
                    >
                    </OfferItemList>
            ))}
        </div>
 )
}
