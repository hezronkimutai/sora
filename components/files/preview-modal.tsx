"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: {
    type: 'image' | 'pdf' | 'info';
    url?: string;
    data?: {
      name: string;
      type: string;
      size: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export function PreviewModal({ isOpen, onClose, previewData }: PreviewModalProps) {
  if (!previewData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogTitle>
          {previewData.type === 'image' && 'Image Preview'}
          {previewData.type === 'pdf' && 'PDF Preview'}
          {previewData.type === 'info' && previewData.data?.name}
        </DialogTitle>
        {previewData.type === 'image' && previewData.url && (
          <div className="relative w-full h-[80vh]">
            <Image
              src={previewData.url}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </div>
        )}

        {previewData.type === 'pdf' && previewData.url && (
          <div className="relative w-full h-[80vh]">
            <iframe
              src={previewData.url}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        )}

        {previewData.type === 'info' && previewData.data && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{previewData.data.name}</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm font-medium">{previewData.data.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Size</dt>
                <dd className="text-sm font-medium">
                  {formatFileSize(previewData.data.size)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm font-medium">
                  {new Date(previewData.data.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Modified</dt>
                <dd className="text-sm font-medium">
                  {new Date(previewData.data.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}