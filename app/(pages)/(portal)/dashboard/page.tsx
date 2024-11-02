import OfferListSsr from "@/components/offer-jobs/offer-list-ssr";
import Map from "@/components/map";
import MapaEstatico from "@/components/mapbuscador";


export default function DashboardPage() {



    return (
        <div>
            Dashboard page
            <OfferListSsr
            />
            {/* <div>
                <Map
                    latitud={-34.603722}
                    longitud={-58.381592}
                    />
            </div>
            <div>
            <MapaEstatico
                latitud={-34.603722}
                longitud={-58.381592}
            />
            </div> */}
        </div>
    );
}