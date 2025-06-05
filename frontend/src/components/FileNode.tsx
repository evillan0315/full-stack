// src/components/FileNode.tsx

import { createSignal, Show, For, onMount, createMemo } from 'solid-js';
import { Icon } from '@iconify-icon/solid'; // Ensure this package is installed
import api from '../services/api'; // Assuming 'api' is an Axios instance or similar HTTP client
import type { FileItem } from '../types'; // Ensure FileItem is imported from your types file

// --- Helper for File Icons ---

const getFileIcon = (filename: string, isDirectory: boolean, isOpen?: boolean) => {
  if (isDirectory) {
    return isOpen ? 'vscode-icons:default-folder-opened' : 'vscode-icons:default-folder';
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    js: 'vscode-icons:file-type-js',
    jsx: 'tabler:file-type-jsx',
    ts: 'vscode-icons:file-type-typescript',
    tsx: 'tabler:file-type-tsx',
    json: 'bi:filetype-json',
    html: 'vscode-icons:file-type-html',
    css: 'vscode-icons:file-type-css',
    md: 'lineicons:markdown',
    py: 'vscode-icons:file-type-python',
    java: 'vscode-icons:file-type-java',
    cpp: 'vscode-icons:file-type-cpp',
    cs: 'vscode-icons:file-type-csharp',
    png: 'bi:filetype-png',
    jpg: 'bi:filetype-jpg',
    gif: 'bi:filetype-gif',
    env: 'vscode-icons:file-type-dotenv',
    sh: 'bi:terminal',
    config: 'vscode-icons:folder-type-config', // This is for folder type, might reconsider for specific files
    xml: 'vscode-icons:file-type-xml',
    csv: 'bi:filetype-csv',
    doc: 'vscode-icons:file-type-doc',
    docx: 'vscode-icons:file-type-docx',
    gitignore: 'simple-icons:gitignoredotio',
    // Add more as needed
  };

  return icons[ext] || 'vscode-icons:default-file';
};

// --- FileNodeProps Interface ---

/**
 * Interface for the props of the FileNode component.
 */
interface FileNodeProps {
  /**
   * The file item data to display.
   */
  file: FileItem;
  /**
   * Callback function triggered when a file is selected (e.g., clicked).
   * @param path The path of the selected file.
   */
  onSelect: (path: string) => void;
  /**
   * Callback function triggered when the context menu is opened on the file node (e.g., right-click).
   * @param e The mouse event that triggered the context menu.
   * @param file The FileItem object associated with the context menu event.
   */
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
  /**
   * Optional callback function to refresh the file list in the parent component.
   * This is crucial after actions like rename, create, delete.
   */
  onRefresh?: (directory?: string) => void; // onRefresh can take directory parameter now
}

// --- FileNode Component ---

const FileNode = (props: FileNodeProps) => {
  const [open, setOpen] = createSignal(false);
  const [editing, setEditing] = createSignal(false);
  const [newName, setNewName] = createSignal(props.file.name);

  // Memoized icon that reacts to `open` state if it's a directory
  const currentIcon = createMemo(() => {
    return getFileIcon(props.file.name, props.file.isDirectory, open());
  });

  const isDir = props.file.isDirectory;
  // Check if children array exists and has length
  const hasChildren = createMemo(() => isDir && props.file.children && props.file.children.length > 0);

  // Toggle open state for directories
  const toggle = () => {
    if (isDir) {
      setOpen(!open());
    }
  };

  // Handle click on the file node
  const handleClick = () => {
    if (isDir) {
      toggle(); // Toggle folder open state
    } else {
      props.onSelect(props.file.path); // Call onSelect for files
    }
  };

  // Handle renaming action
  const handleRename = async () => {
    const trimmed = newName().trim();
    // Only proceed if name changed and is not empty
    if (!trimmed || trimmed === props.file.name) {
      return setEditing(false); // Exit editing if no change or empty
    }

    try {
      // Assuming your backend has a /file/rename endpoint
      await api.post('/file/rename', {
        oldPath: props.file.path,
        // The new path will be the parent directory + newName
        newPath: `${props.file.path.substring(0, props.file.path.lastIndexOf('/') + 1)}${trimmed}`,
      });
      // Refresh the parent list to show the updated name
      props.onRefresh?.();
    } catch (err) {
      console.error('Rename failed:', err);
      // Revert name if rename fails for UX
      setNewName(props.file.name);
      alert(`Failed to rename: ${(err as any).response?.data?.message || (err as Error).message}`);
    } finally {
      setEditing(false);
    }
  };

  // Handle keydown for input field (e.g., Enter to commit, Escape to cancel)
  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(props.file.name); // Revert to original name
      setEditing(false); // Exit editing mode
    }
  };

  // Set initial name when component mounts or file prop changes
  onMount(() => {
    setNewName(props.file.name);
  });
  // If the file object changes (e.g. after a parent refresh)
  // we might want to update the displayed name for consistency.
  // This is handled by Solid's reactivity on props.file.name directly in the fallback.
  // The newName signal is primarily for the input field.

  return (
    <div class="relative">
      <div
        class="cursor-pointer hover:bg-gray-900/50 px-1 rounded flex items-center gap-x-2"
        onClick={handleClick}
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => {
          if (!isDir && !editing()) { // Only allow double-click to edit files
            setEditing(true);
          }
        }}
      >
        {/* Indentation for nested items. Adjust ml-4 if already in a nested structure */}
        {/* For directories, add a small arrow/chevron for expand/collapse */}
        {isDir && (
          <Icon
            icon={open() ? 'mdi:chevron-down' : 'mdi:chevron-right'}
            class="w-4 h-4 text-gray-500"
          />
        )}
        <Icon width="20" height="20" icon={currentIcon()} />

        <Show
          when={editing()}
          fallback={
            <span class="truncate max-w-[220px]">{props.file.name}</span>
          }
        >
          <input
            class="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded px-1 text-sm flex-grow"
            value={newName()}
            autofocus
            onInput={(e) => setNewName(e.currentTarget.value)}
            onBlur={handleRename}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent div
          />
        </Show>
      </div>

      {/* Render children recursively if directory is open and has children */}
      <Show when={open() && hasChildren()}>
        <div class="pl-5 border-l border-gray-300 dark:border-gray-900 ml-1"> {/* Adjust margin/padding */}
          <For each={props.file.children}>
            {(child) => (
              <FileNode
                file={child}
                onSelect={props.onSelect}
                onContextMenu={props.onContextMenu}
                onRefresh={props.onRefresh} // Pass refresh prop down
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default FileNode;
