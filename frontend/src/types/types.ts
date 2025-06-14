// src/types/index.ts (or src/types.ts)
export interface FeatureCardProps {
  id?: string;
  /**
   * The icon to display in the card. This should be a valid icon identifier
   * supported by the `@iconify-icon/solid` library.  For example, 'mdi:account'.
   *
   * @example
   * ```typescript
   * <FeatureCard icon="mdi:account" title="Account Management" description="Manage your user accounts efficiently." />
   * ```
   *
   *  **Best Practices:**
   *  - Refer to the `@iconify-icon/solid` documentation for available icon sets and identifiers.
   *  - Consider creating a type alias or enum for valid icon values if your application uses a limited set of icons.  This will improve type safety.
   *  - Use a consistent naming convention for icons to improve maintainability.
   */
  icon: string; // You can refine this type based on your icon system

  /**
   * The title of the feature card.  This will be displayed prominently.
   *
   * @example
   * ```typescript
   * <FeatureCard title="Performance Optimization" description="Improve the speed and responsiveness of your application." />
   * ```
   */
  title: string;

  /**
   * A brief description of the feature.  This provides more detail about what the feature does.
   *
   * @example
   * ```typescript
   * <FeatureCard title="Real-time Data" description="Access up-to-date information from various sources." />
   * ```
   */
  description: string;
  page?: string;
}
export interface Feature {
  id: string;
  title: string;
  icon: string;
  description: string;
  page: string;
}
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
