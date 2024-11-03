'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface FileDownloaderProps {
  fileUrl: string
  fileName: string
}

export default function FileDownloader({ fileUrl, fileName }: FileDownloaderProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full sm:w-auto inline-flex items-center justify-center"
      aria-label={isDownloading ? 'Descargando archivo' : `Descargar ${fileName}`}
    >
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isDownloading ? 'Descargando...' : `Descargar ${fileName}`}
    </Button>
  )
}