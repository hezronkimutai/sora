"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface CreateDocumentButtonProps {
  folderId?: string;
}

export function CreateDocumentButton({ folderId }: CreateDocumentButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      
      // Create an empty document
      const response = await fetch("/api/files/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Untitled Document.docx",
          folderId,
          content: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const data = await response.json();
      
      // Navigate to editor
      router.push(`/document/${data.id}`);
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isCreating}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      <FileText className="w-5 h-5" />
      {isCreating ? "Creating..." : "Create Document"}
    </button>
  );
}