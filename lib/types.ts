// Basic types from Prisma schema
export interface File {
  id: string;
  name: string;
  type: string;
  cloudinaryId: string;
  publicId: string;
  size: number;
  userId: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  folder?: Folder;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: Folder[];
  files?: File[];
  _count?: {
    files: number;
    children: number;
  };
}

// API response types
export interface UploadUrlResponse {
  uploadUrl: string;
  fields: {
    signature: string;
    timestamp: number;
    api_key: string;
    folder: string;
  };
}

// Use File and Folder types directly instead of empty interfaces
export type { File as FileResponse };
export type { Folder as FolderResponse };