import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobOfferForm from "./form-offer";
import OfferList from "./offer-list";

export default function OfferTabsMenu() {
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
                <OfferList/>
            </TabsContent>
            <TabsContent value="nueva-oferta">
                <JobOfferForm/>
            </TabsContent>
            <TabsContent value="postulaciones">Postulaciones</TabsContent>
        </Tabs>
    </div>
    </>
 );
}