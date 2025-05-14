import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateUploadSignature } from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    headers(); // Ensure headers are read before auth
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileType = searchParams.get('type') || '';
    
    // Determine resource type based on file type
    const resourceType = fileType.startsWith('video/') ? 'video' :
                        fileType.startsWith('audio/') ? 'video' :
                        'auto';

    const { signature, timestamp, cloudName, apiKey } = generateUploadSignature();

    // Return Cloudinary upload configuration
    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      fields: {
        signature,
        timestamp,
        api_key: apiKey,
        folder: "drive-clone",
        resource_type: resourceType
      },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}