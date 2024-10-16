"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  onFileUploaded: (fileUrl: string) => void
  allowedTypes: string[] // MIME Types 
  maxSizeInBytes: number
  label: string
}

export function FileUpload({ onFileUploaded, allowedTypes, maxSizeInBytes, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Por favor, sube un archivo de tipo: ${allowedTypes.join(", ")}`
    }
    if (file.size > maxSizeInBytes) {
      return `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeInBytes / 1000000} MB.`
    }
    return null
  }
  //TODO: Implement delete file
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        body: formData
      })
      if (!response.ok) {
        setError("Ocurrió un error al subir el archivo. Por favor, intente de nuevo.")
        return
      }

      const data = await response.json()
      setFileUrl(data.url)
      onFileUploaded(data.url)
    } catch (err) {
      setError("Ocurrió un error al subir el archivo. Por favor, intente de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 w-auto">
      <Label htmlFor="file-upload">{label} <span className="text-sm text-gray-500">(Opcional)</span></Label>
      <Input
        id="file-upload"
        type="file"
        className="p-2 border rounded-md"
        accept={allowedTypes.join(",")}
        onChange={handleUpload}
        disabled={uploading}
      />
      <p className="text-sm text-gray-500">Tamaño máximo: {maxSizeInBytes / 1000000} MB, extensiones permitidas: {allowedTypes.map(mime => mime.split('/')[1]).join(',')}</p>
      {uploading && <p>Subiendo archivo...</p>}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}