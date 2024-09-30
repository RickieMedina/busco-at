import {auth} from '@/auth'
import TopMenu from '@/components/top-menu'
import { SessionProvider } from "next-auth/react"


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    
  const session = await auth()
  return (
        <SessionProvider session={session}>
            <TopMenu />
            {children}
        </SessionProvider>

  )
}