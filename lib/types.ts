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

export interface FileResponse extends File {}
export interface FolderResponse extends Folder {}