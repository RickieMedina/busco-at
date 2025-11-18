import { FAQModal } from "@/components/about/faqs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
            <CardTitle className="text-3xl font-bold">Acerca de BuscoAT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
            <p className="text-muted-foreground">
              BuscoAT es la plataforma líder en conectar Acompañantes Terapéuticos con quienes necesitan sus servicios. 
              Nuestra misión es facilitar el acceso a oportunidades laborales para profesionales AT y 
              simplificar el proceso de búsqueda para las familias e instituciones.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">¿Qué Hacemos?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Para Profesionales AT</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Acceso a ofertas laborales verificadas</li>
                    <li>Herramientas para gestionar tu perfil profesional</li>
                    <li>Conexión directa con potenciales empleadores</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Para Empleadores</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Búsqueda simplificada de profesionales calificados</li>
                    <li>Publicación de ofertas laborales</li>
                    <li>Sistema de verificación de credenciales</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
            <p className="text-muted-foreground">
              ¿Tienes preguntas o sugerencias? No dudes en contactarnos:
              <br />
              Email: contacto@buscoat.com
              <br />
              Teléfono: (351) 675-5250
            </p>
          </section>
          <section>
           <FAQModal/>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}