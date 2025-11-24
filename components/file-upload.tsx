"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Paperclip, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileUploadProps {
  onFileUploaded: (fileUrl: string) => void
  uploading?: boolean
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
    <div className="space-y-1 w-auto max-w-md">
      <div className="flex items-center gap-2 mb-1">
        <Paperclip className="h-3.5 w-3.5 text-gray-500" />
        <Label htmlFor="file-upload" className="text-xs font-medium">{label}</Label>
        {fileUrl && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span className="text-xs">✓</span>
          </div>
        )}
      </div>
      <Input
        id="file-upload"
        type="file"
        className="text-xs p-1.5 h-8 file:text-xs w-full"
        accept={allowedTypes.join(",")}
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p className="text-xs text-gray-500">Subiendo...</p>}
      {error && (
        <Alert variant="destructive" className="py-1 px-2">
          <AlertCircle className="h-3 w-3" />
          <AlertTitle className="text-xs">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}