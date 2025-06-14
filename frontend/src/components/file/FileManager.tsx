// src/components/FileManager.tsx

import { createSignal, createMemo, createEffect, onMount, onCleanup, For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import * as path from 'path-browserify';

import api from '../../services/api';
import type { FileItem } from '../../types/types';
import { useEditorFile } from '../../hooks/useEditorFile';

import FileNode from './FileNode';

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

export default function FileManager(props: FileManagerProps) {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const [currentPath, setCurrentPath] = createSignal('./');
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  const { fetchFile, fetchDirectory, directoryFiles, currentDirectory } = useEditorFile();

  const fileTree = createMemo(() => files());

  props.refreshList?.((dir) => fetchDirectory(dir || currentPath()));

  /*const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    isDirectory ? fetchDirectory(filePath) : props.onFileSelect?.(filePath);
  };*/
  const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchDirectory(filePath);
    } else {
      console.log(filePath, 'filePath handleFileNodeSelect FileManager');
      // Call parent-provided loadFile
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
    const menu = document.getElementById('context-menu');
    if (menu && !menu.contains(e.target as Node)) {
      closeContextMenu();
    }
  };

  const handleFileAction = async (action: 'open' | 'delete' | 'create', type?: 'file' | 'folder') => {
    const file = contextMenu().file;
    if (!file) return;

    closeContextMenu();

    try {
      if (action === 'open') {
        file.isDirectory ? fetchDirectory(file.path) : props.onFileSelect?.(file.path);
        return;
      }

      if (action === 'create') {
        const name = prompt(`Enter name for new ${type}:`)?.trim();
        if (!name) {
          alert('Name cannot be empty.');
          return;
        }
        const newPath = path.join(file.path, name);
        await api.post('/file/create', {
          filePath: newPath,
          isDirectory: type === 'folder',
          content: type === 'file' ? '' : undefined,
        });
      }

      if (action === 'delete') {
        if (!confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) return;
        await api.post('/file/delete', { filePath: file.path });
      }

      await fetchDirectory(currentPath());
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Error: ${(err as any).response?.data?.message || (err as Error).message}`);
    }
  };

  const navigateUp = () => {
    const parent = path.dirname(currentPath());
    if (parent !== currentPath()) {
      fetchDirectory(parent);
    }
  };

  createEffect(() => {
    if (directoryFiles()) {
      setFiles(directoryFiles());
      setCurrentPath(currentDirectory());
    }
  });

  onMount(() => {
    fetchDirectory(currentDirectory());
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="relative w-full h-full flex flex-col">
      <div class="flex-grow overflow-auto p-4">
        <For
          each={fileTree()}
          fallback={<p class="text-center text-gray-500">No files or folders in this directory.</p>}
        >
          {(file) => (
            <FileNode
              file={file}
              onSelect={handleFileNodeSelect}
              onContextMenu={handleContextMenu}
              onRefresh={() => fetchDirectory(currentPath())}
            />
          )}
        </For>
      </div>

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
