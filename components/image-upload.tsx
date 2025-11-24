"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react"

interface ImageUploadProps {
  currentImage?: string | null
  onImageUploaded: (fileUrl: string) => void
  fallback: string
}

export function ImageUpload({ currentImage, onImageUploaded, fallback }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5000000) {
      setError('La imagen no debe superar los 5MB')
      return
    }

    // Preview inmediato
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload a Cloudinary
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }
      
      const data = await response.json()
      onImageUploaded(data.url)
    } catch (err) {
      setError("Error al subir la imagen")
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-32 h-32">
        <AvatarImage src={preview || undefined} className="object-cover" />
        <AvatarFallback className="text-2xl">{fallback}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="avatar-upload">
          <Button 
            variant="outline" 
            disabled={uploading}
            className="cursor-pointer"
            type="button"
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Cambiar foto
                </>
              )}
            </span>
          </Button>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <p className="text-xs text-muted-foreground">
          JPG, PNG o GIF (máx. 5MB)
        </p>
      </div>
    </div>
  )
}
