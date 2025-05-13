"use client";

import type { File } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MoreVertical, Eye, Trash, Pencil } from "lucide-react";
import { PreviewModal } from "./preview-modal";
import { RenameDialog } from "@/components/ui/rename-dialog";

interface FileListProps {
  files: File[];
}

export function FileList({ files }: FileListProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{
    type: 'image' | 'pdf' | 'info';
    url?: string;
    data?: {
      name: string;
      type: string;
      size: number;
      createdAt: string;
      updatedAt: string;
    };
  } | null>(null);

  const handleDelete = async (fileId: string) => {
    try {
      setIsDeleting(fileId);
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting file:', error);
      // TODO: Add error toast
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePreview = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/preview?id=${fileId}`);
      if (!response.ok) {
        throw new Error('Failed to get file preview');
      }

      const data = await response.json();
      setPreviewData(data);
      setPreviewModalOpen(true);
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  const handleRename = async (newName: string) => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/files?id=${selectedFile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename file');
      }

      router.refresh();
    } catch (error) {
      console.error('Error renaming file:', error);
      // TODO: Add error toast
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-6 h-6 text-green-500"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-6 h-6 text-gray-500"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  return (
    <>
      {selectedFile && (
        <RenameDialog
          isOpen={renameDialogOpen}
          onClose={() => {
            setRenameDialogOpen(false);
            setSelectedFile(null);
          }}
          onRename={handleRename}
          currentName={selectedFile.name}
          type="file"
        />
      )}
      {previewData && (
        <PreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewData(null);
          }}
          previewData={previewData}
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {getFileIcon(file.type)}
              <span className="font-medium truncate">{file.name}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>{formatFileSize(file.size)}</p>
              <p>Added {new Date(file.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handlePreview(file.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedFile(file);
                      setRenameDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(file.id)}
                    disabled={isDeleting === file.id}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    {isDeleting === file.id ? 'Deleting...' : 'Delete'}
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