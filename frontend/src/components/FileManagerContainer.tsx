// src/components/FileManagerContainer.tsx

import { createSignal, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import FileManager from './FileManager';
import type { FileItem } from '../types'; // Keep FileItem if you use it for other purposes here

// --- Interfaces ---

interface FileManagerContainerProps {
  // `left` can be a string (e.g., "1fr", "200px") or a number (e.g., 1 for flex-grow)
  // If it's a Solid.js signal, it should be Accessor<string | number>
  left?: Accessor<string | number> | string | number;
  /**
   * Callback function to load the content of a selected file.
   * This is passed down to FileManager's onFileSelect.
   * It expects a file path string.
   */
  loadFile?: (filePath: string) => void;
  // `currentDirectory` and `files` props are likely not needed here if FileManager manages its own state.
  // If FileManagerContainer is meant to *pass* initial files, then keep them.
  // For now, assuming FileManager is self-contained.
  // currentDirectory?: string;
  // files?: FileItem[];
}

// --- FileManagerContainer Component ---

const FileManagerContainer = (props: FileManagerContainerProps) => {
  // refreshFileList now stores the actual fetchFiles function from FileManager
  const [refreshFileList, setRefreshFileList] = createSignal<((directory?: string) => Promise<void>) | null>(null);
  const [isOpen, setIsOpen] = createSignal(true);
  let contentRef: HTMLDivElement | undefined; // Reference to the collapsible content div

  const togglePanel = () => {
    const el = contentRef;
    if (!el) return;

    if (isOpen()) {
      // Collapse
      el.style.maxHeight = `${el.scrollHeight}px`; // Set explicit height before transition
      requestAnimationFrame(() => {
        el.style.maxHeight = '0px';
        el.style.overflow = 'hidden'; // Hide overflow during collapse
      });
    } else {
      // Expand
      el.style.maxHeight = '0px'; // Start from collapsed state
      el.style.overflow = 'hidden'; // Ensure hidden during initial phase of expand
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`; // Expand to full height
        // After a brief delay, set maxHeight back to 'none' for proper scrolling
        setTimeout(() => {
          if (el) {
            el.style.maxHeight = 'none';
            el.style.overflow = 'visible'; // Allow scrolling after expand animation
          }
        }, 300); // Must match transition duration
      });
    }
    setIsOpen(!isOpen());
  };

  onMount(() => {
    // If initially open, ensure max-height is 'none' for content scrolling
    if (isOpen() && contentRef) {
      contentRef.style.maxHeight = 'none';
    }
  });

  return (
    // Conditional flex style based on whether props.left is a signal or direct value
    <div
      class="flex min-h-0 min-w-0 flex-col overflow-hidden relative"
      // Use a Solid.js memo or directly access the prop if it's a signal
      // If props.left is a signal (Accessor<T>), call it; otherwise, use it directly.
      style={`flex: ${typeof props.left === 'function' ? props.left() : props.left || 1}`} // Default to 1 if not provided
    >
      {/* Sticky Collapsible Header */}
      <div class="sticky top-0 z-20 border-b bg-gray-500/10 border-gray-500/30">
        <div class="flex items-center justify-between p-2">
          <button
            class="flex items-center gap-2 px-2 py-1 text-sm uppercase tracking-widest text-left dark:hover:text-yellow-500"
            onClick={togglePanel}
          >
            <Icon icon="mdi:file" width="22" height="22" /> File Explorer
          </button>

          <div class="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              class="cursor-pointer flex items-center gap-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => {
                const refresh = refreshFileList();
                if (refresh) {
                  // Check if refresh function exists
                  refresh(); // Call the refresh function
                }
              }}
              title="Refresh files"
            >
              <Icon icon="mdi:refresh" width="18" height="18" />
            </button>

            {/* Toggle Panel Chevron */}
            <Icon
              icon={isOpen() ? 'mdi:chevron-down' : 'mdi:chevron-right'}
              width="18"
              height="18"
              class="transition-transform duration-200 cursor-pointer"
              onClick={togglePanel} // Allow clicking chevron to toggle
            />
          </div>
        </div>
      </div>

      {/* Animated Collapsible Body */}
      {/* The `mt-12` was likely for spacing below the header. Re-evaluate if needed.
          The `overflow-auto` should be on the container with fixed height/max-height. */}
      <div
        ref={contentRef}
        class="transition-[max-height] duration-300 ease-in-out overflow-auto" // Added overflow-auto here
        // Initial state for max-height based on isOpen
        style={isOpen() ? 'max-height: none;' : 'max-height: 0px;'}
      >
        <div class="pb-4 pt-2">
          {' '}
          {/* Added some padding inside */}
          {/* onFileSelect now takes a filePath (string) */}
          <FileManager
            onFileSelect={props.loadFile} // Pass the loadFile prop directly
            // `refreshList` now expects a function that takes `(directory?: string) => Promise<void>`
            // We store the actual `fetchFiles` function from `FileManager` into our signal.
            refreshList={(fn) => setRefreshFileList(() => fn)}
          />
        </div>
      </div>
    </div>
  );
};

export default FileManagerContainer;
