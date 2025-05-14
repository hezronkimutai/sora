import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const updateDocumentSchema = z.object({
  content: z.string(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    await headers();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const documentId = params.documentId;

    // Verify document ownership
    const file = await db.file.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("Document not found", { status: 404 });
    }

    const json = await req.json();
    const body = updateDocumentSchema.parse(json);

    // Upload updated content to Cloudinary
    const blob = new Blob([body.content], { type: "text/plain" });
    const buffer = Buffer.from(await blob.arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          format: "txt",
          folder: "drive-clone",
          public_id: file.cloudinaryId,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    if (!uploadResponse || typeof uploadResponse !== 'object') {
      throw new Error("Failed to update document");
    }

    // Update file record
    const updatedFile = await db.file.update({
      where: {
        id: documentId,
      },
      data: {
        size: (uploadResponse as any).bytes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("Error updating document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}