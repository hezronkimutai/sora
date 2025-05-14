"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";
import { Save } from "lucide-react";

interface DocumentEditorProps {
  initialContent?: string;
  documentId: string;
}

export function DocumentEditor({ initialContent = "", documentId }: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const saveContent = useCallback(async () => {
    if (!editor) return;

    try {
      const response = await fetch(`/api/files/document/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editor.getHTML(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }, [editor, documentId]);

  // Auto-save every 5 seconds if content changed
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      if (editor.isEmpty) return;
      saveContent();
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, saveContent]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={saveContent}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-background">
        <EditorContent editor={editor} className="min-h-screen" />
      </div>
    </div>
  );
}