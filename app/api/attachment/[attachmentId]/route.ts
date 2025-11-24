import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/attachment/[attachmentId] - Update attachment file location
export async function PUT(
  request: Request,
  { params }: { params: { attachmentId: string } }
) {
  try {
    const { attachmentId } = params;
    const body = await request.json();
    const { file_location } = body;

    if (!file_location) {
      return NextResponse.json(
        { error: 'La ubicación del archivo es requerida' },
        { status: 400 }
      );
    }

    const attachment = await db.attachment.update({
      where: { attachment_id: parseInt(attachmentId) },
      data: {
        file_location,
        created_at: new Date() // Update timestamp
      }
    });

    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.error('Error actualizando adjunto:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar el adjunto' },
      { status: 500 }
    );
  }
}

// POST /api/attachment/[attachmentId] - Create new attachment for professional
export async function POST(
  request: Request,
  { params }: { params: { attachmentId: string } }
) {
  try {
    const professionalId = params.attachmentId; // In this case, it's professional_id
    const body = await request.json();
    const { file_location, attachment_type } = body;

    if (!file_location || !attachment_type) {
      return NextResponse.json(
        { error: 'La ubicación del archivo y el tipo son requeridos' },
        { status: 400 }
      );
    }

    const attachment = await db.attachment.create({
      data: {
        professional_id: parseInt(professionalId),
        attachment_type: parseInt(attachment_type),
        file_location,
        created_at: new Date()
      }
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.error('Error creando adjunto:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el adjunto' },
      { status: 500 }
    );
  }
}
