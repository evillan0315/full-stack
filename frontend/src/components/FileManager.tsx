// src/components/FileManager.tsx

import { createSignal, createMemo, onMount, onCleanup, For, Show } from 'solid-js';
import api from '../services/api';
import FileNode from '../components/FileNode';
import Loading from '../components/Loading';
import { Icon } from '@iconify-icon/solid';
import type { FileItem } from '../types';
import * as path from 'path-browserify';

// --- Interfaces ---

type ContextMenuState = {
  x: number;
  y: number;
  file: FileItem | null;
  visible: boolean;
};

interface FileManagerProps {
  onFileSelect?: (path: string) => void;
  refreshList?: (refreshFn: (directory?: string) => Promise<void>) => void;
}

// --- Helper Functions ---

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

export default function FileManager(props: FileManagerProps) {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const [currentPath, setCurrentPath] = createSignal<string>('/');
  const [loading, setLoading] = createSignal(true);
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

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

  props.refreshList?.((dir?: string) => fetchFiles(dir || currentPath())); // Pass currentPath as default

  const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchFiles(filePath);
    } else {
      props.onFileSelect?.(filePath);
    }
  };

  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file,
      visible: true,
    });
  };

  const closeContextMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));

  const handleClickOutside = (e: MouseEvent) => {
    const menuElement = document.getElementById('context-menu');
    if (menuElement && !menuElement.contains(e.target as Node)) {
      closeContextMenu();
    }
  };

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

  onMount(() => {
    fetchFiles(currentPath());
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

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
      {/* Path Navigation / Controls */}
      <div class="flex items-center p-2 border-b bg-gray-100 dark:bg-gray-700">
        <button
          onClick={currentPath() !== '/' ? navigateUp : undefined}
          disabled={currentPath() === '/'}
          class={`p-2 rounded ${currentPath() === '/' ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          title="Go Up"
        >
          <Icon icon="mdi:arrow-up-bold" class="w-5 h-5" />
        </button>
        <span class="mx-2 text-sm font-medium">Path: {currentPath() === '/' ? '/' : `${currentPath()}`}</span>
        <button
          onClick={() => fetchFiles(currentPath())}
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ml-auto"
          title="Refresh"
        >
          <Icon icon="mdi:refresh" class="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFileAction('create', 'file')}
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ml-2"
          title="New File"
        >
          <Icon icon="mdi:file-plus" class="w-5 h-5" />
        </button>
        <button
          onClick={() => handleFileAction('create', 'folder')}
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ml-2"
          title="New Folder"
        >
          <Icon icon="mdi:folder-plus" class="w-5 h-5" />
        </button>
      </div>

      {/* File List / Loading */}
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
          class="fixed min-w-[160px] border shadow-md rounded p-2 z-50 bg-white dark:bg-gray-800"
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
              class="text-sm text-yellow-500 hover:underline cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleFileAction('open')}
            >
              Open
            </li>

            <Show when={contextMenu().file!.type === 'folder'}>
              <li
                class="text-sm text-green-600 hover:underline cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleFileAction('create', 'file')}
              >
                ➕ New File
              </li>
              <li
                class="text-sm text-green-600 hover:underline cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleFileAction('create', 'folder')}
              >
                📁 New Folder
              </li>
            </Show>

            <li
              class="text-sm text-red-500 hover:underline cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
