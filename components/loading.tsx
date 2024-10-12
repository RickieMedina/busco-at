import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: number
  text?: string
  fullScreen?: boolean
}

export function Loading({ size = 24, text = "Cargando...", fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {content}
    </div>
  )
}