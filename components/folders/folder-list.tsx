"use client";

import type { Folder } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { RenameDialog } from "@/components/ui/rename-dialog";

interface FolderListProps {
  folders: Folder[];
}

export function FolderList({ folders }: FolderListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleDelete = async (folderId: string) => {
    try {
      setIsDeleting(folderId);
      const response = await fetch(`/api/folders?id=${folderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting folder:', error);
      // TODO: Add error toast
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRename = async (newName: string) => {
    if (!selectedFolder) return;

    try {
      const response = await fetch(`/api/folders?id=${selectedFolder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename folder');
      }

      router.refresh();
    } catch (error) {
      console.error('Error renaming folder:', error);
      // TODO: Add error toast
    }
  };

  return (
    <>
      {selectedFolder && (
        <RenameDialog
          isOpen={renameDialogOpen}
          onClose={() => {
            setRenameDialogOpen(false);
            setSelectedFolder(null);
          }}
          onRename={handleRename}
          currentName={selectedFolder.name}
          type="folder"
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="relative p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div 
            onClick={() => router.push(`/folder/${folder.id}`)}
            className="cursor-pointer"
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
          </div>
          
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedFolder(folder);
                    setRenameDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(folder.id)}
                  disabled={isDeleting === folder.id}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {isDeleting === folder.id ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}