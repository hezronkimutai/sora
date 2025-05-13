import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

const createFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.string(),
  size: z.number(),
  cloudinaryId: z.string(),
  publicId: z.string(),
  folderId: z.string().optional().nullable(), // Allow null from input
});

export async function POST(req: Request) {
  try {
    headers(); // Ensure headers are read before auth
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createFileSchema.parse(json);

    const fileData: {
      name: string;
      type: string;
      size: number;
      cloudinaryId: string;
      publicId: string;
      userId: string;
      folderId?: string | null; // Make folderId optional in this intermediate object
    } = {
      name: body.name,
      type: body.type,
      size: body.size,
      cloudinaryId: body.cloudinaryId,
      publicId: body.publicId,
      userId,
    };

    fileData.folderId = body.folderId ?? null; // Ensure folderId is either a string or null

    const file = await db.file.create({
      data: fileData,
    });

    return NextResponse.json(file);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating file record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    headers(); // Ensure headers are read before auth
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    const files = await db.file.findMany({
      where: {
        userId,
        folderId: folderId || null, // Query for null if folderId is not provided
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    headers(); // Ensure headers are read before auth
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

    // Delete file from Cloudinary
    const cloudinary = require("cloudinary").v2;
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Delete file record
    await db.file.delete({
      where: {
        id: fileId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}