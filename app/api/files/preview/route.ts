import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await headers();
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

    console.log('Preview request for file:', {
      id: file.id,
      name: file.name,
      type: file.type,
      publicId: file.publicId,
      cloudinaryId: file.cloudinaryId
    });

    // Initialize preview URL
    let previewUrl: string | undefined;

    // Detect file types
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    const isText = file.type.startsWith('text/') ||
                  file.type === 'application/json' ||
                  file.type === 'application/javascript';

    console.log('File type detection:', { isImage, isPdf, isVideo, isAudio, isText });

    // Handle video first since it needs special handling
    if (isVideo) {
      // Use just the cloudinaryId which is already the correct public_id
      console.log('Using cloudinaryId for video:', file.cloudinaryId);
      
      // Generate simple video URL without transformations
      const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${file.cloudinaryId}`;
      console.log('Generated simple video URL:', videoUrl);

      return NextResponse.json({
        type: 'video',
        url: videoUrl
      });
      console.log('Generated video URL:', videoUrl);
      return NextResponse.json({
        type: 'video',
        url: videoUrl
      });
    }

    // Handle audio next as it also uses video resource type
    if (isAudio) {
      return NextResponse.json({
        type: 'audio',
        url: cloudinary.url(file.cloudinaryId, {
          resource_type: 'video',
          secure: true
        })
      });
    }


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
    }

    // Handle text files
    if (isText) {
      return NextResponse.json({
        type: 'text',
        url: cloudinary.url(file.cloudinaryId, {
          resource_type: 'raw',
          secure: true
        })
      });
    }

    // For image/pdf files with preview URL
    if (previewUrl) {
      return NextResponse.json({
        type: isImage ? 'image' : 'pdf',
        url: previewUrl
      });
    }

    // Fallback to file info for unsupported types
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

  } catch (error) {
    console.error("Error generating file preview:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}