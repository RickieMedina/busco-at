import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FileDownloader from "./file-download"
import { Attachment } from "@/lib/interfaces/professional"
import { FileText } from "lucide-react"

interface AttachmentListProps {
  attachments: Attachment[]
}

export default function AttachmentList({ attachments = [] }: AttachmentListProps) {
  return (
    <div className="space-y-4">
      {attachments.map((attachment) => (
        <Card key={attachment.attachment_id}>
          <div className="flex flex-row justify justify-evenly items-center" >
            <CardHeader>
                <div className="flex flex-row items-center text-md gap-2">
                    <FileText/>
                    <CardTitle>{attachment.attachment_type_attachment_attachment_typeToattachment_type.name.charAt(0).toUpperCase()+
                            attachment.attachment_type_attachment_attachment_typeToattachment_type.name.slice(1)}
                    </CardTitle>
                </div>
                <CardDescription className="text-sm">{attachment.attachment_type_attachment_attachment_typeToattachment_type.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-2">
                <FileDownloader
                fileUrl={attachment.file_location}
                fileName=''
                />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}