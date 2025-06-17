import { createMemo, onMount, onCleanup, For, Show, createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import * as path from 'path-browserify';
import FileNode from '../../components/file/FileNode';
import Loading from '../../components/Loading';

import { useEditorFile } from '../../hooks/useEditorFile';
import type { FileItem } from '../../types/types';
import { Button } from '../../components/ui/Button';
import { confirm, prompt, alert } from '../../services/modalService';

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

function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  files.forEach((file) => map.set(file.path, { ...file, children: [] }));

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
        console.warn(`Orphaned file/folder: ${file.path}. Parent '${parentPath}' not found.`);
        tree.push(file);
      }
    }
  }

  const sortTree = (nodes: FileItem[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children?.length && sortTree(n.children));
  };

  sortTree(tree);
  return tree;
}

export default function FileManager(props: FileManagerProps) {
  const { directoryFiles, currentDirectory, fetchDirectory, fetchFile, loading } = useEditorFile();

  const fileTree = createMemo(() => buildTree(directoryFiles()));

  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  const handleFileNodeSelect = (filePath: string, isDirectory: boolean) => {
    if (isDirectory) {
      fetchDirectory(filePath);
    } else {
      fetchFile(filePath);
      props.onFileSelect?.(filePath);
    }
  };

  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file, visible: true });
  };

  const closeContextMenu = () => setContextMenu((c) => ({ ...c, visible: false }));

  const handleClickOutside = (e: MouseEvent) => {
    if (!document.getElementById('context-menu')?.contains(e.target as Node)) {
      closeContextMenu();
    }
  };

  const handleFileAction = async (action: 'open' | 'delete' | 'create', type?: 'file' | 'folder') => {
    const file = contextMenu().file;
    if (!file) return;
    closeContextMenu();

    try {
      if (action === 'open') {
        handleFileNodeSelect(file.path, file.isDirectory);
        return;
      }

      if (action === 'create') {
        const name = await prompt(`Enter name for new ${type}:`, '', 'info');
        if (!name) {
          await alert('Name cannot be empty.', 'warning');
          return;
        }
        await api.post('/file/create', {
          filePath: path.join(file.path, name),
          isDirectory: type === 'folder',
          content: type === 'file' ? '' : undefined,
        });
      }

      if (action === 'delete') {
        const confirmed = await confirm(`Delete "${file.name}"? This action cannot be undone.`, 'warning');
        if (!confirmed) return;
        await api.post('/file/delete', { filePath: file.path });
      }

      await fetchDirectory(currentDirectory() || './');
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      await alert(`Error: ${(err as any).response?.data?.message || (err as Error).message}`, 'error');
    }
  };

  const navigateUp = () => {
    const parent = path.dirname(currentDirectory() || '/');
    if (parent !== currentDirectory()) fetchDirectory(parent);
  };

  onMount(() => {
    fetchDirectory('/');
    document.addEventListener('click', handleClickOutside);
    props.refreshList?.(fetchDirectory);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="w-full h-full flex flex-col relative">
      <div class="file-manager-header sticky top-0 z-10 flex items-center justify-between gap-2 h-8 px-3 py-0 border-b">
        <div class="flex-inline">
          <Button
            icon="mdi:arrow-up-bold"
            variant="secondary"
            onClick={currentDirectory() !== './' ? navigateUp : undefined}
            disabled={currentDirectory() === './'}
            title="Go Up"
          />

          <span class="mx-2 text-sm font-medium">Path: {currentDirectory()}</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <Button
            icon="mdi:refresh"
            variant="secondary"
            size="sm"
            onClick={() => fetchDirectory(currentDirectory() || './')}
            title="Refresh"
          />

          <Button
            icon="mdi:file-plus"
            variant="secondary"
            size="sm"
            onClick={() => handleFileAction('create', 'file')}
            title="New File"
          />
          <Button
            icon="mdi:folder-plus"
            variant="secondary"
            size="sm"
            onClick={() => handleFileAction('create', 'folder')}
            title="New Folder"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1 overflow-auto p-4">
        <Show
          when={!loading()}
          fallback={
            <div class="h-full flex items-center justify-center relative">
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
                onSelect={(filePath) => handleFileNodeSelect(filePath, file.isDirectory)}
                onContextMenu={handleContextMenu}
                onRefresh={() => fetchDirectory(currentDirectory() || './')}
              />
            )}
          </For>
        </Show>
      </div>

      <Show when={contextMenu().visible && contextMenu().file}>
        <div
          id="context-menu"
          class="file-manager-context-menu fixed min-w-[160px] border shadow-md rounded z-50"
          style={{ top: `${contextMenu().y}px`, left: `${contextMenu().x}px` }}
        >
          <div class="px-2 font-semibold truncate">{contextMenu().file!.name}</div>
          <div class="flex items-center gap-2 px-2 text-sm">
            <Icon icon={contextMenu().file!.isDirectory ? 'mdi:folder' : 'mdi:file'} width="1.4em" height="1.4em" />
            {contextMenu().file!.isDirectory ? 'Folder' : 'File'}
          </div>
          <ul class="space-y-1 mt-2 border-t">
            <li class="text-sm text-yellow-500 cursor-pointer p-2 rounded " onClick={() => handleFileAction('open')}>
              Open
            </li>
            <Show when={contextMenu().file!.isDirectory}>
              <>
                <li
                  class="text-sm text-green-600 cursor-pointer p-2 rounded "
                  onClick={() => handleFileAction('create', 'file')}
                >
                  ➕ New File
                </li>
                <li
                  class="text-sm text-green-600 cursor-pointer p-2 rounded "
                  onClick={() => handleFileAction('create', 'folder')}
                >
                  📁 New Folder
                </li>
              </>
            </Show>
            <li class="text-sm text-red-500 cursor-pointer p-2 rounded " onClick={() => handleFileAction('delete')}>
              ❌ Delete
            </li>
          </ul>
        </div>
      </Show>
    </div>
  );
}
