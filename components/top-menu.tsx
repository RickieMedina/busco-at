"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TopMenu() {

  const session = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }
  
  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
        <div className="text-xl font-bold">BuscoAT</div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          { session.data?.user &&(
            <SheetContent side="right" className="w-full sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-left">Perfil: {session.data?.user.role}</SheetTitle>
              </SheetHeader>
                {/* section rol admin */}
                {session.data?.user.role === "admin" && (
                  <div className="mt-8 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => {router.push('/dashboard'); setIsOpen(false);}}>
                      Inicio
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => {router.push('/admin/usuarios'); setIsOpen(false);}}>
                      Usuarios
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => {router.push('/admin/areas-atencion'); setIsOpen(false);}}>
                      Tipos Atención
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => {router.push('/admin/pacientes'); setIsOpen(false);}}>
                      Tipos Paciente
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => signOut()}>
                      Cerrar sesión
                    </Button>
                  </div>
                )}
              
                {/* section rol profesional*/}
                {session.data?.user.role === "profesional" && (
                  <div className="mt-8 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsOpen(false)}>
                      Perfil
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsOpen(false)}>
                      Configuración
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => signOut()}>
                      Cerrar sesión
                    </Button>
                  </div>
                )}
              
                {/* section rol empleador */}
                {session.data?.user.role === "empleador" && (
                  <div className="mt-8 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsOpen(false)}>
                      Perfil
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsOpen(false)}>
                      Configuración
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => signOut()}>
                      Cerrar sesión
                    </Button>
                  </div>
                )}
            </SheetContent>
          )}
          { !session.data?.user && (
            <SheetContent side="right" className="w-full sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="text-left">Perfil</SheetTitle>
              <SheetDescription>Para acceder a las opciones de perfil en la plataforma inicia sesión</SheetDescription>
            </SheetHeader>
                <div className="mt-8 space-y-4">
                  <Button variant="ghost" className="w-full justify-start text-lg" onClick={handleLogin}>
                    Iniciar Sesión
                  </Button>
                </div>
          </SheetContent>
          )}
          
        </Sheet>
      </nav>
    </>
  )
}