
import { auth } from "@/auth";
import OfferTabsMenu from "@/components/offer-jobs/offer-tabs-menu";
import { mapIOfferToTypeOffer } from "@/lib/utils";

const getOffers = async () => {
    
    const session = await auth()
    if (!session?.user) return null

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offer/${session.user.user_id}`, {cache: "no-store"});
    if (!response.ok) {
        return null;
    }
    
    const offers = await response.json();
    return offers;
}

export default async function OfferPage() {

    const offers = await getOffers();
    const offersModel = mapIOfferToTypeOffer(offers);

      return (
        <div>
            <OfferTabsMenu
                offers={offersModel}
            />
        </div>
    );
}
