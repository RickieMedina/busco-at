
import { map } from "leaflet";
import OfferItemList from "./offer-item-list";
import { Offer } from '../../types/offer';

interface OfferListProps {
    offers: Offer[];
}

export default  function OfferList({offers}: OfferListProps) {
    
return (
        <div>
            {offers.map((offer) => (
                    <OfferItemList offer={offer}
                                   isApplication={false}
                    >
                    </OfferItemList>
            ))}
        </div>
 )
}
