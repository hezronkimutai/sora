"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface CreateFolderButtonProps {
  parentId?: string;
}

export function CreateFolderButton({ parentId }: CreateFolderButtonProps) {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, parentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      setName("");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Folder
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Create New Folder</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-2 border rounded-md mb-4 bg-background text-foreground border-input"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-foreground/70 hover:text-foreground"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}