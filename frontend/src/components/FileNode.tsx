import { createSignal, Show, For } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

import api from '../services/api';
import type { FileItem } from '@/types';

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
    config: 'vscode-icons:folder-type-config',
    xml: 'vscode-icons:file-type-xml',
    csv: 'bi:filetype-csv',
    doc: 'vscode-icons:file-type-doc',
    docx: 'vscode-icons:file-type-docx',
    gitignore: 'simple-icons:gitignoredotio',
  };

  return icons[ext] || 'vscode-icons:default-file';
};

const FileNode = (props: {
  file: FileItem;
  onSelect: (path: string) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
  onRefresh?: () => void;
}) => {
  const [open, setOpen] = createSignal(false);
  const [editing, setEditing] = createSignal(false);
  const [newName, setNewName] = createSignal(props.file.name);
  const [icon, setIcon] = createSignal(getFileIcon(props.file.name, false) || 'vscode-icons:default-folder');

  const isDir = props.file.isDirectory;
  const hasChildren = props.file.children && props.file.children.length > 0;

  const toggle = () => {
    if (isDir) setOpen(!open());
  };

  const handleRename = async () => {
    const trimmed = newName().trim();
    if (!trimmed || trimmed === props.file.name) return setEditing(false);
    try {
      await api.post('/file/rename', {
        oldPath: props.file.path,
        newName: trimmed,
      });
      props.onRefresh?.();
    } catch (err) {
      console.error('Rename failed:', err);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div class="ml-4">
      <div
        class="cursor-pointer hover:bg-gray-900/50 px-1 rounded"
        onClick={() => (isDir ? toggle() : props.onSelect(props.file.path))}
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => setEditing(true)}
      >
        <Show
          when={editing()}
          fallback={
            <div class="text-md inline-flex gap-x-2 items-center max-w-[220px] truncate whitespace-nowrap overflow-hidden">
              <Icon
                width="20"
                height="20"
                icon={isDir ? (open() ? 'vscode-icons:default-folder-opened' : 'vscode-icons:default-folder') : icon()}
              />
              <span class="truncate">{props.file.name}</span>
            </div>
          }
        >
          <input
            class="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded px-1 text-sm"
            value={newName()}
            autofocus
            onInput={(e) => setNewName(e.currentTarget.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRename();
              }
            }}
          />
        </Show>
      </div>

      <div class="pl-3 border-l border-gray-300 dark:border-gray-900" style={{ display: open() ? 'block' : 'none' }}>
        <Show when={hasChildren}>
          <For each={props.file.children}>
            {(child) => (
              <FileNode
                file={child}
                onSelect={props.onSelect}
                onContextMenu={props.onContextMenu}
                onRefresh={props.onRefresh}
              />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default FileNode;
