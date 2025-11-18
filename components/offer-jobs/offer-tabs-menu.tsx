import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobOfferForm from "./form-offer";
import OfferList from "./offer-list";
import ApplicationList from "../application/application-detail";
import { Offer } from "@/types/offer";

interface OfferTabsProps {
    offers: Offer[];
}

export default function OfferTabsMenu({offers}: OfferTabsProps) {
    
return (
    <>
    <div>
        <Tabs defaultValue="ofertas">
            <TabsList className="w-full m-1">
                <TabsTrigger value="ofertas">Mis Ofertas</TabsTrigger>
                <TabsTrigger value="nueva-oferta">Registrar oferta de Trabajo</TabsTrigger>
                <TabsTrigger value="postulaciones">Gestionar Postulaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="ofertas">
                <OfferList
                    offers={offers}
                    isApplication={false}
                />
            </TabsContent>
            <TabsContent value="nueva-oferta">
                <JobOfferForm/>
            </TabsContent>
            <TabsContent value="postulaciones">
                <ApplicationList
                    offers={offers} 
                />
            </TabsContent>
        </Tabs>
    </div>
    </>
 );
}