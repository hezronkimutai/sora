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

const createDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  folderId: z.string().optional().nullable(),
  content: z.string(),
});

const updateDocumentSchema = z.object({
  content: z.string(),
});

export async function POST(req: Request) {
  try {
    await headers();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createDocumentSchema.parse(json);

    // Create initial content and upload to Cloudinary
    const initialContent = "New Document\n\n";
    const blob = new Blob([initialContent], { type: "text/plain" });
    const buffer = Buffer.from(await blob.arrayBuffer());

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          format: "txt",
          folder: "drive-clone",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    if (!uploadResponse || typeof uploadResponse !== 'object') {
      throw new Error("Failed to upload document");
    }

    const file = await db.file.create({
      data: {
        name: body.name,
        type: "text/plain",
        size: ((uploadResponse as any).bytes as number) || 0,
        cloudinaryId: (uploadResponse as any).public_id,
        publicId: (uploadResponse as any).secure_url,
        userId,
        folderId: body.folderId ?? null,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error creating document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await headers();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return new NextResponse("Document ID is required", { status: 400 });
    }

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