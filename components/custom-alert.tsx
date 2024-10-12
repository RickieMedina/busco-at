import { useRef, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, X } from "lucide-react"

type CustomAlertProps = {
  tipo: 'exito' | 'error'
  titulo: string
  mensaje: string
  onClose: () => void
}

export function CustomAlert({ tipo, titulo, mensaje, onClose }: CustomAlertProps) {
  const esExito = tipo === 'exito'
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-lg w-full">
        <Alert variant={esExito ? "default" : "destructive"} className="relative">
          {esExito ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle className="text-lg">{titulo}</AlertTitle>
          <AlertDescription className="text-sm mt-2">{mensaje}</AlertDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={onClose}
            aria-label="Cerrar alerta"
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      </div>
    </div>
  )
}