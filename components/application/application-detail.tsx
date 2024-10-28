import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users } from "@/lib/interfaces/user"
import { Application } from "@/lib/interfaces/application"
import ProfileViewerWrapper from "../profile/profile-view-wrapper"
import ConfirmApplication from "./application-confirm"
import RejectedApplication from "./application-rejected"
import JobOfferSelector from "../offer-jobs/offer-selector"


// interface Professional {
//   professional_id: number
//   hourly_rate: number
//   identification_number: string
// }

// interface Application {
//   application_id: number
//   professional_id: number
//   job_offer_id: number
//   application_date: string
//   application_status: string
//   professional: Professional
//   users: User
// }

interface ApplicationListProps {
  offer_id: number
}

async function getApplications(offer_id: number): Promise<Application[]> {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/offers/${offer_id}`,{ cache: 'no-cache'} )
  if (!response.ok) {
    throw new Error('Failed to fetch applications')
  }
  return response.json()
}

export default async function ApplicationList({ offer_id }: ApplicationListProps) {
  let applications: Application[] = []

  try {
    console.log('Fetching ApplicationList for offer:', offer_id)
    applications = await getApplications(offer_id)
  } catch (error) {
    console.error('Error fetching applications:', error)
  }


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Gestionar Postulaciones</CardTitle>
        <CardDescription>
          Revise y gestione las postulaciones para esta oferta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profesional</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Valor Hora</TableHead>
              <TableHead>Fecha Postulación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.application_id}>
                <TableCell>{app.professional?.users.name} {app.professional?.users.last_name}</TableCell>
                <TableCell> <ProfileViewerWrapper professional={app.professional!} /></TableCell>
                <TableCell>${app.professional?.hourly_rate.toLocaleString()}</TableCell>
                <TableCell>{new Date(app.application_date).toLocaleDateString()}</TableCell>
                <TableCell className="capitalize">{app.application_status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ConfirmApplication
                        id= {app.application_id}
                    />
                    <RejectedApplication
                        id= {app.application_id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

