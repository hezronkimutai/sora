import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { DocumentEditor } from "@/components/editor/document-editor";

interface DocumentPageProps {
  params: {
    documentId: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const file = await db.file.findFirst({
    where: {
      id: params.documentId,
      userId,
    },
  });

  if (!file) {
    return notFound();
  }

  // Get file content from Cloudinary if it exists
  let content = "";
  if (file.cloudinaryId) {
    const response = await fetch(file.publicId);
    if (response.ok) {
      content = await response.text();
    }
  }

  return (
    <div className="h-screen bg-background">
      <DocumentEditor documentId={params.documentId} initialContent={content} />
    </div>
  );
}