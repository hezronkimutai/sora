"use client";

import type { Folder } from "@/lib/types";
import { useRouter } from "next/navigation";

interface FolderListProps {
  folders: Folder[];
}

export function FolderList({ folders }: FolderListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => router.push(`/folder/${folder.id}`)}
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-blue-500"
            >
              <path d="M3 7v10c0 1.1.9 2 2 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="font-medium truncate">{folder.name}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(folder.createdAt).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );
}