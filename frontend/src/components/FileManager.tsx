import { createSignal, createEffect, onMount, onCleanup, For, Show } from 'solid-js';
import api from '../services/api';
import Loading from '../components/Loading';
import { Icon } from '@iconify-icon/solid';
const getFileIcon = (filename: string, isDirectory: boolean, isOpen?: boolean) => {
  if (isDirectory) {
    return isOpen ? 'vscode-icons:default-folder-opened' : 'vscode-icons:default-folder';
  }

  const extension = filename.split('.').pop()?.toLowerCase();
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

  return icons[extension || ''] || 'vscode-icons:default-file';
};

type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children: FileItem[];
};

type ContextMenuState = {
  x: number;
  y: number;
  file: FileItem | null;
  visible: boolean;
};

function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  for (const file of files) {
    map.set(file.path, { ...file, children: file.children || [] });
  }

  const tree: FileItem[] = [];
  for (const file of map.values()) {
    const segments = file.path.split('/');
    if (segments.length === 1) {
      tree.push(file);
    } else {
      const parentPath = segments.slice(0, -1).join('/');
      const parent = map.get(parentPath);
      if (parent) parent.children.push(file);
    }
  }
  return tree;
}

const FileNode = (props: {
  file: FileItem;
  onSelect: (path: string) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
}) => {
  const [open, setOpen] = createSignal(false);
  const [editing, setEditing] = createSignal(false);
  const [newName, setNewName] = createSignal(props.file.name);
  const [icon, setIcon] = createSignal(getFileIcon(props.file.name, false) || 'vscode-icons:default-folder');

  const isDir = props.file.isDirectory && props.file.children.length > 0;
  const toggle = () => {
    if (isDir) setOpen(!open());
  };

  return (
    <div class="ml-4">
      <div
        class="cursor-pointer hover:bg-gray-900/50"
        onClick={() => (isDir ? toggle() : props.onSelect(props.file.path))}
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => setEditing(true)}
      >
        <Show
          when={editing()}
          fallback={
            <div class="text-md inline-flex gap-x-2 items-center max-w-[220px] truncate whitespace-nowrap overflow-hidden">
              {isDir ? (
                open() ? (
                  <Icon width="20" height="20" icon="vscode-icons:default-folder-opened" />
                ) : (
                  <Icon width="20" height="20" icon="vscode-icons:default-folder" />
                )
              ) : (
                <Icon width="20" height="20" icon={icon()} />
              )}

              <span class="truncate">{props.file.name}</span>
            </div>
          }
        >
          <input
            class="border border-neutral-300 rounded px-1"
            value={newName()}
            autofocus
            onInput={(e) => setNewName(e.currentTarget.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setEditing(false);
              }
            }}
          />
        </Show>
      </div>

      <div class="pl-3 border-l border-gray-300 dark:border-gray-900" style={{ display: open() ? 'block' : 'none' }}>
        <For each={props.file.children}>
          {(child) => <FileNode file={child} onSelect={props.onSelect} onContextMenu={props.onContextMenu} />}
        </For>
      </div>
    </div>
  );
};

export default function FileManager(props: { onFileSelect: (path: string) => void }) {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const [loading, setLoading] = createSignal(true);

  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  const fetchFileList = async () => {
    setLoading(true);
    try {
      const res = await api.get(`file/list?directory=./&recursive=false`);
      if (res.data) setFiles(res.data);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContextMenu = (e: MouseEvent, file: FileItem) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setContextMenu({
      x: rect.left,
      y: rect.bottom,
      file,
      visible: true,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#context-menu')) closeContextMenu();
  };

  onMount(() => {
    fetchFileList();
    document.addEventListener('click', handleClickOutside);
    onCleanup(() => document.removeEventListener('click', handleClickOutside));
  });

  return (
    <div class="relative">
      <Show
        when={!loading()}
        fallback={
          <div class="h-[calc(100vh-4rem)]">
            <Loading />
          </div>
        }
      >
        <For each={buildTree(files())}>
          {(file) => <FileNode file={file} onSelect={props.onFileSelect} onContextMenu={handleContextMenu} />}
        </For>
      </Show>

      <Show when={contextMenu().visible && contextMenu().file}>
        <div
          id="context-menu"
          class="fixed min-w-[140px] border shadow-md rounded p-2 z-50 bg-white dark:bg-gray-800"
          style={{
            top: `${contextMenu().y}px`,
            left: `${contextMenu().x}px`,
          }}
        >
          <div class="text-sm font-semibold">{contextMenu().file?.name}</div>
          <div class="text-xs mb-2">{contextMenu().file?.type === 'folder' ? '📁 Folder' : '📄 File'}</div>
          <div
            class="text-sm text-yellow-500 hover:underline cursor-pointer"
            onClick={() => {
              props.onFileSelect(contextMenu().file!.path);
              closeContextMenu();
            }}
          >
            Open
          </div>
          <div
            class="text-sm text-red-500 hover:underline cursor-pointer mt-1"
            onClick={() => {
              alert(`Delete ${contextMenu().file!.name} (not implemented)`);
              closeContextMenu();
            }}
          >
            Delete
          </div>
        </div>
      </Show>
    </div>
  );
}
