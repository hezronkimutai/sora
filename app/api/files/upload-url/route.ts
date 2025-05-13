import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateUploadSignature } from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    headers(); // Ensure headers are read before auth
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { signature, timestamp, cloudName, apiKey } = generateUploadSignature();

    // Return Cloudinary upload configuration
    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      fields: {
        signature,
        timestamp,
        api_key: apiKey,
        folder: "drive-clone",
      },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}