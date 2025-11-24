'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import FileDownloader from "./file-download"
import { FileUpload } from "../file-upload"
import { Attachment } from "@/lib/interfaces/professional"
import { FileText, Edit, X, Save } from "lucide-react"

interface EditableAttachmentListProps {
  attachments: Attachment[]
  professionalId: number
  isEditing: boolean
  onAttachmentUpdated?: () => void
}

export default function EditableAttachmentList({ 
  attachments = [], 
  professionalId,
  isEditing,
  onAttachmentUpdated 
}: EditableAttachmentListProps) {
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newFileUrl, setNewFileUrl] = useState<string | null>(null)

  const handleEditClick = (attachmentId: number) => {
    setEditingId(attachmentId)
    setNewFileUrl(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setNewFileUrl(null)
  }

  const handleFileUploaded = (url: string) => {
    setNewFileUrl(url)
  }

  const handleSaveAttachment = async (attachmentId: number) => {
    if (!newFileUrl) return

    setUploading(true)
    try {
      const response = await fetch(`/api/attachment/${attachmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_location: newFileUrl })
      })

      if (!response.ok) throw new Error('Error al actualizar adjunto')

      setEditingId(null)
      setNewFileUrl(null)
      
      if (onAttachmentUpdated) {
        onAttachmentUpdated()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el archivo')
    } finally {
      setUploading(false)
    }
  }

  const handleCreateAttachment = async (attachmentType: number, fileUrl: string) => {
    setUploading(true)
    try {
      const response = await fetch(`/api/attachment/${professionalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file_location: fileUrl,
          attachment_type: attachmentType
        })
      })

      if (!response.ok) throw new Error('Error al crear adjunto')

      if (onAttachmentUpdated) {
        onAttachmentUpdated()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el archivo')
    } finally {
      setUploading(false)
    }
  }

  // Check which attachment types exist
  const cvAttachment = attachments.find(att => att.attachment_type === 1)
  const certAttachment = attachments.find(att => att.attachment_type === 2)

  return (
    <div className="space-y-4">
      {/* CV Attachment */}
      <Card>
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <div>
                <CardTitle className="text-base">Curriculum vitae</CardTitle>
                <CardDescription className="text-xs">Documento principal del profesional</CardDescription>
              </div>
            </div>
            {isEditing && cvAttachment && editingId !== cvAttachment.attachment_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(cvAttachment.attachment_id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>

          {cvAttachment ? (
            editingId === cvAttachment.attachment_id ? (
              <div className="space-y-3">
                <FileUpload
                  label="Nuevo archivo"
                  allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
                  onFileUploaded={handleFileUploaded}
                  maxSizeInBytes={5000000}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveAttachment(cvAttachment.attachment_id)}
                    disabled={!newFileUrl || uploading}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {uploading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <FileDownloader
                fileUrl={cvAttachment.file_location}
                fileName="curriculum-vitae"
              />
            )
          ) : (
            isEditing && (
              <FileUpload
                label="Subir curriculum vitae"
                allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
                onFileUploaded={(url) => handleCreateAttachment(1, url)}
                maxSizeInBytes={5000000}
              />
            )
          )}
        </div>
      </Card>

      {/* Certificate Attachment */}
      <Card>
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <div>
                <CardTitle className="text-base">Certificados profesionales</CardTitle>
                <CardDescription className="text-xs">Certificaciones y títulos (opcional)</CardDescription>
              </div>
            </div>
            {isEditing && certAttachment && editingId !== certAttachment.attachment_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(certAttachment.attachment_id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>

          {certAttachment ? (
            editingId === certAttachment.attachment_id ? (
              <div className="space-y-3">
                <FileUpload
                  label="Nuevo archivo"
                  allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
                  onFileUploaded={handleFileUploaded}
                  maxSizeInBytes={5000000}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveAttachment(certAttachment.attachment_id)}
                    disabled={!newFileUrl || uploading}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {uploading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <FileDownloader
                fileUrl={certAttachment.file_location}
                fileName="certificados"
              />
            )
          ) : (
            isEditing && (
              <FileUpload
                label="Subir certificados"
                allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
                onFileUploaded={(url) => handleCreateAttachment(2, url)}
                maxSizeInBytes={5000000}
              />
            )
          )}
        </div>
      </Card>
    </div>
  )
}
