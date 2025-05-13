import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    headers();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return new NextResponse("File ID is required", { status: 400 });
    }

    // Verify file ownership
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    let previewUrl: string;
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (isImage) {
      // Generate optimized image preview URL with Cloudinary
      previewUrl = cloudinary.url(file.publicId, {
        transformation: [
          { width: 800, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    } else if (isPdf) {
      // Generate PDF preview URL (first page as image)
      previewUrl = cloudinary.url(file.publicId, {
        transformation: [
          { page: 1 },
          { width: 800, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    } else {
      // For other file types, return file info
      return NextResponse.json({
        type: 'info',
        data: {
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt
        }
      });
    }

    return NextResponse.json({
      type: isImage ? 'image' : 'pdf',
      url: previewUrl
    });

  } catch (error) {
    console.error("Error generating file preview:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}