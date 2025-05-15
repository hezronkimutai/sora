"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface UploadButtonProps {
  folderId?: string;
}

export function UploadButton({ folderId }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Get upload URL and signature
      console.log('Uploading file:', { name: file.name, type: file.type });
      
      // Pass file type to get correct upload configuration
      const uploadUrlRes = await fetch(`/api/files/upload-url?type=${encodeURIComponent(file.type)}`);
      const { uploadUrl, fields } = await uploadUrlRes.json();

      // Create form data for Cloudinary
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      // Upload to Cloudinary with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        }
      });

      xhr.onreadystatechange = async function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            console.log('Cloudinary upload result:', result);
            
            // Create file record in database with correct IDs
            const fileData = {
              name: file.name,
              type: file.type,
              size: file.size,
              cloudinaryId: result.public_id,
              publicId: result.secure_url,
              folderId,
            };

            await fetch("/api/files", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(fileData),
            });

            router.refresh();
          } else {
            console.error("Upload failed");
          }
          setIsUploading(false);
          setProgress(0);
        }
      };

      xhr.open("POST", uploadUrl, true);
      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        {isUploading ? `Uploading ${progress}%` : "Upload File"}
      </button>

      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg z-[999999]">
          <div className="text-sm font-medium mb-2 text-foreground">Uploading...</div>
          <div className="w-64 h-2 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}