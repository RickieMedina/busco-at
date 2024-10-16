import cloudinary from '@/lib/cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        const fileBuffer = await file.arrayBuffer();

        const mimeType = file.type;
        const encoding = "base64";
        const base64Data = Buffer.from(fileBuffer).toString("base64");

        // this will be used to upload the file
        const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

        const res = await uploadToCloudinary(fileUri, file.name);

        if (res.success && res.result){
            return NextResponse.json({url: res.result.secure_url}, { status: 200 });
        } 
        else{
            return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 400 });
        }
    } 
    catch (error) {
        console.log(JSON.stringify(error));
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

}

type UploadResponse = { success: true; result?: UploadApiResponse } | { success: false; error: UploadApiErrorResponse };

//This function uploads the file to Cloudinary
const uploadToCloudinary = (fileUri: string, fileName: string): Promise<UploadResponse> => {
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "files", // any sub-folder name  cloud
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};