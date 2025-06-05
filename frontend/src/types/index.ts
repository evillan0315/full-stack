// src/types/index.ts (or src/types.ts)

export interface FileItem { // Remove the '=' here
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children?: FileItem[]; // Optional: for nested file/folder structures
  size?: number;          // Optional: file size in bytes
  lastModified?: Date;    // Optional: last modification date
}
