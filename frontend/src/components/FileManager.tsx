// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/FileManager.tsx

import { createSignal, createMemo, onMount, onCleanup, For, Show } from 'solid-js';
import api from '../services/api';
import FileNode from '../components/FileNode';
import Loading from '../components/Loading';
import { Icon } from '@iconify-icon/solid';
import type { FileItem } from '../types';
import * as path from 'path-browserify';

// --- Interfaces ---

/**
 * Represents the state of the context menu.
 */
type ContextMenuState = {
  /**
   * The x-coordinate of the context menu.
   */
  x: number;
  /**
   * The y-coordinate of the context menu.
   */
  y: number;
  /**
   * The file item associated with the context menu.  Null if no file is associated.
   */
  file: FileItem | null;
  /**
   * Whether the context menu is visible.
   */
  visible: boolean;
};

/**
 * Defines the props for the FileManager component.
 */
interface FileManagerProps {
  /**
   * Callback function to be executed when a file is selected.
   * @param path The path of the selected file.
   */
  onFileSelect?: (path: string) => void;
  /**
   * A function that accepts a refresh function as a parameter.  This allows the parent component to trigger a refresh of the file list.
   * @param refreshFn A function that, when called, refreshes the file list.  Optionally takes a directory path as an argument.
   */
  refreshList?: (refreshFn: (directory?: string) => Promise<void>) => void;
}

// --- Helper Functions ---

/**
 * Builds a tree structure from a flat array of file items.
 * @param files An array of FileItem objects representing files and folders.
 * @returns An array of FileItem objects representing the root nodes of the file tree.
 */
function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();

  for (const file of files) {
    map.set(file.path, { ...file, children: [] });
  }

  const tree: FileItem[] = [];
  for (const file of map.values()) {
    const parentPath = path.dirname(file.path);

    if (parentPath === '.' || parentPath === file.path) {
      tree.push(file);
    } else {
      const parent = map.get(parentPath);
      if (parent) {
        parent.children.push(file);
      } else {
        console.warn(`Orphaned file/folder: ${file.path}. Parent '${parentPath}' not found in map.`);
        tree.push(file);
      }
    }
  }

  tree.forEach((node) => {
    // FIX: Ensure node.children is an array before sorting
    // This is safer if FileItem interface *could* have undefined children sometimes
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    }
  });
  tree.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  return tree;
}

// --- FileManager Component ---

/**
 * A component that displays a file manager interface.
 * @param props The props for the FileManager component.
 * @returns A JSX element representing the file manager.
 */
export default function FileManager(props: FileManagerProps) {
  /**
   * A signal that holds the array of file items.
   */
  const [files, setFiles] = createSignal<FileItem[]>([]);
  /**
   * A signal that holds the current path being displayed.
   */
  const [currentPath, setCurrentPath] = createSignal<string>('/');
  /**
   * A signal that indicates whether the file list is loading.
   */
  const [loading, setLoading] = createSignal(true);
  /**
   * A signal that holds the state of the context menu.
   */
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  /**
   * A memoized value that represents the file tree based on the current path and files.
   *  If the API returns a flat list of files in the current directory, this simply returns `files()`.
   */
  const fileTree = createMemo(() => {
    // If your API returns all files and folders recursively, `buildTree` is needed.
    // If your API returns only direct children of `currentPath()`, you might filter `files()` here
    // or adjust `buildTree` to operate on a pre-filtered list or remove `buildTree` entirely.
    // For now, assuming `files()` holds all items and `buildTree` filters for the current path.
    // However, the previous `buildTree` was designed to build a full tree,
    // and filtering at render time makes more sense for a flat list from API.
    // Let's modify buildTree to assume it's given the direct children of the current path
    // OR if files() is the *full* flat list, then you'd need to filter for the current path's children.
    // Assuming `files()` returns the *direct children* of `currentPath()`.
    return files(); // if files() is already the flat list of current dir children
  });

  /**
   * Fetches the files for a given directory from the API.
   * @param directory The directory to fetch files from. Defaults to the root directory ('./').
   */
  const fetchFiles = async (directory?: string) => {
    setLoading(true);
    try {
      const targetDirectory = directory !== undefined ? directory : './';
      const query =
        targetDirectory && targetDirectory !== './' ? `?directory=${encodeURIComponent(targetDirectory)}&` : '?';
      //console.log(query, 'query fetchFiles');
      const response = await api.get(`/file/list?directory=.%2F`);
      console.log(response, 'response fetchFiles');
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from API. Expected an array of FileItem.');
      }

      // Backend should return direct children of the requested directory.
      // No need for `buildTree` if API gives flat list for current directory.
      setFiles(response.data as FileItem[]);
      setCurrentPath(targetDirectory);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      alert(`Failed to fetch files: ${(error as any).response?.data?.message || (error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Passes the `fetchFiles` function to the parent component via the `refreshList` prop.
   * Allows the parent to trigger a file list refresh.
   */
  props.refreshList?.((dir?: string) => fetchFiles(dir || currentPath())); // Pass currentPath as default

  /**
   * Handles the selection of a file node.
   * If the node is a directory, it fetches the files for that directory.
   * If the node is a file, it calls the `onFileSelect` callback.
   * @param filePath The path of the selected file.
   * @param isDirectory Whether the selected node is a directory.
   */
  const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchFiles(filePath);
    } else {
      props.onFileSelect?.(filePath);
    }
  };

  /**
   * Handles the display of the context menu.
   * @param e The mouse event that triggered the context menu.
   * @param file The file item associated with the context menu.
   */
  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
      visible: true,
    });
  };

  /**
   * Closes the context menu.
   */
  const closeContextMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));

  /**
   * Handles clicks outside the context menu, closing it.
   * @param e The mouse event that triggered the click.
   */
  const handleClickOutside = (e: MouseEvent) => {
    const menuElement = document.getElementById('context-menu');
    if (menuElement && !menuElement.contains(e.target as Node)) {
      closeContextMenu();
    }
  };

  /**
   * Handles file actions such as opening, deleting, and creating files and folders.
   * @param action The action to perform ('open', 'delete', 'create').
   * @param type The type of file to create ('file', 'folder'). Only relevant for the 'create' action.
   */
  const handleFileAction = async (action: 'open' | 'delete' | 'create', type?: 'file' | 'folder') => {
    const file = contextMenu().file;
    if (!file) return;

    closeContextMenu();

    if (action === 'open') {
      if (!file.isDirectory) {
        props.onFileSelect?.(file.path);
      } else {
        fetchFiles(file.path);
      }
      return;
    }

    let apiEndpoint = '';
    let apiPayload: any = {};

    if (action === 'create') {
      const name = prompt(`Enter name for new ${type === 'folder' ? 'folder' : 'file'}:`)?.trim();
      if (!name) {
        alert('Name cannot be empty.');
        return;
      }
      const newPath = path.join(file.path, name);
      apiEndpoint = '/file/create';
      apiPayload = {
        filePath: newPath,
        isDirectory: type === 'folder',
        content: type === 'file' ? '' : undefined,
      };
    } else if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
        return;
      }
      apiEndpoint = '/file/delete';
      apiPayload = { filePath: file.path };
    }

    if (apiEndpoint) {
      try {
        await api.post(apiEndpoint, apiPayload);
        fetchFiles(currentPath());
      } catch (err) {
        console.error(`Error performing ${action} action:`, err);
        alert(`Error: ${(err as any).response?.data?.message || (err as Error).message}`);
      }
    }
  };

  /**
   * A lifecycle hook that is called when the component is mounted.
   * Fetches the files for the current path and adds a click listener to the document.
   */
  onMount(() => {
    fetchFiles(currentPath());
    document.addEventListener('click', handleClickOutside);
  });

  /**
   * A lifecycle hook that is called when the component is unmounted.
   * Removes the click listener from the document.
   */
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  /**
   * Navigates to the parent directory.
   */
  const navigateUp = () => {
    const parentPath = path.dirname(currentPath());
    // Ensure we don't go above the root. path.dirname('/') typically returns '/'.
    // If it returns '.', means it's a relative path from current directory.
    if (parentPath !== currentPath()) {
      fetchFiles(parentPath);
    }
  };

  return (
    <div class="relative w-full h-full flex flex-col">
      <div class="flex-grow overflow-auto p-4">
        <Show
          when={!loading()}
          fallback={
            <div class="h-full flex items-center justify-center">
              <Loading />
            </div>
          }
        >
          <For
            each={fileTree()}
            fallback={<p class="text-center text-gray-500">No files or folders in this directory.</p>}
          >
            {(file) => (
              <FileNode
                file={file}
                onSelect={handleFileNodeSelect} // fileNode handles path + isDirectory
                onContextMenu={handleContextMenu}
                onRefresh={(dir) => fetchFiles(dir || currentPath())}
              />
            )}
          </For>
        </Show>
      </div>

      {/* Context Menu */}
      <Show when={contextMenu().visible && contextMenu().file}>
        <div
          id="context-menu"
          class="fixed min-w-[160px] border shadow-md rounded p-2 z-50"
          style={{
            top: `${contextMenu().y}px`,
            left: `${contextMenu().x}px`,
          }}
        >
          <div class="text-sm font-semibold truncate">{contextMenu().file!.name}</div>
          <div class="text-xs mb-2 text-gray-500">
            {contextMenu().file!.type === 'folder' ? '📁 Folder' : '📄 File'}
          </div>

          <ul class="space-y-1">
            <li
              class="text-sm text-yellow-500 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleFileAction('open')}
            >
              Open
            </li>

            <Show when={contextMenu().file!.type === 'folder'}>
              <li
                class="text-sm text-green-600 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleFileAction('create', 'file')}
              >
                ➕ New File
              </li>
              <li
                class="text-sm text-green-600 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleFileAction('create', 'folder')}
              >
                📁 New Folder
              </li>
            </Show>

            <li
              class="text-sm text-red-500 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleFileAction('delete')}
            >
              ❌ Delete
            </li>
          </ul>
        </div>
      </Show>
    </div>
  );
}
