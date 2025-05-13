import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Validation schemas
const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional(),
});

const renameFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
});

export async function POST(req: Request) {
  try {
    await headers(); // Ensure headers are initialized
    const { userId, user } = await auth();
    if (!userId) {
      console.error("Authentication failed: No userId present");
      return new NextResponse("Unauthorized: Invalid or missing authentication", { status: 401 });
    }

    
    // Check if user exists in database
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    });
    
    console.log("Existing user:", existingUser);

    if (!existingUser) {
      // Create user if they don't exist
      try {
        await db.user.create({
          data: {
            id: userId,
            email: user?.emailAddresses[0]?.emailAddress || ''
          }
        });
        console.log("Created new user:", userId);
      } catch (error) {
        console.error("Failed to create user:", error);
        return new NextResponse("Failed to create user record", { status: 500 });
      }
    }

    // Validate request headers
    if (req.headers.get("content-type") !== "application/json") {
      return new NextResponse("Invalid content type", { status: 400 });
    }

    const json = await req.json();
    const body = createFolderSchema.parse(json);

    const folder = await db.folder.create({
      data: {
        name: body.name,
        userId: userId,
        parentId: body.parentId,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await headers(); // Ensure headers are initialized
    const c = await auth();
    console.log("Auth response:", {c});
    const { userId } = c;
    if (!userId) {
      console.error("Authentication failed: No userId present in GET request");
      return new NextResponse("Unauthorized: Invalid or missing authentication", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    const folders = await db.folder.findMany({
      where: {
        userId,
        parentId: parentId || undefined,
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await headers(); // Ensure headers are initialized
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("id");

    if (!folderId) {
      return new NextResponse("Folder ID is required", { status: 400 });
    }

    // Verify folder ownership
    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
    });

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    // Delete folder and all its contents (cascade delete will handle children)
    await db.folder.delete({
      where: {
        id: folderId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting folder:", error);
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
    const folderId = searchParams.get("id");

    if (!folderId) {
      return new NextResponse("Folder ID is required", { status: 400 });
    }

    const json = await req.json();
    const body = renameFolderSchema.parse(json);

    // Verify folder ownership
    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
    });

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    // Update folder name
    const updatedFolder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error renaming folder:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}