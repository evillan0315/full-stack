// src/types/index.ts (or src/types.ts)

export interface FileItem {
  // Remove the '=' here
  name: string;
  path: string;
  isDirectory: boolean;
  mimeType?: string;
  lang?: string;
  type: 'file' | 'folder';
  children?: FileItem[]; // Optional: for nested file/folder structures
  size?: number; // Optional: file size in bytes
  url?: string;
}

export interface ReadFileResponseDto {
  /**
   * The absolute or relative path to the file on the server, if applicable (e.g., for local files).
   */
  filePath?: string | null;

  /**
   * The original filename (e.g., "document.pdf", "index.ts").
   */
  filename: string;

  /**
   * The MIME type of the file (e.g., "text/plain", "application/json").
   */
  mimeType: string;

  /**
   * The detected programming language of the file content, if applicable (e.g., "typescript", "json").
   */
  language?: string | null;

  /**
   * The content of the file. For text files, this is raw text. For binary, it is base64-encoded.
   */
  content: string;

  /**
   * A base64 encoded data URL (blob) of the file, if requested.
   * Format: `data:[<mediatype>][;base64],<data>`
   */
  blob?: string | null;
}

export interface GenerateCodeDto {
  prompt: string;
  topic?: string;
  language?: string;
  output?: 'markdown' | 'json' | 'html' | 'text';
}

