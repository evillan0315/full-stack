import { createSignal, createMemo, onMount, onCleanup, For, Show } from 'solid-js';
import api from '../services/api';
import FileNode from '../components/FileNode';
import Loading from '../components/Loading';
import { Icon } from '@iconify-icon/solid';

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

export default function FileManager(props: { onFileSelect: (path: string) => void }) {
  const [files, setFiles] = createSignal<FileItem[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [contextMenu, setContextMenu] = createSignal<ContextMenuState>({
    x: 0,
    y: 0,
    file: null,
    visible: false,
  });

  const fileTree = createMemo(() => buildTree(files()));

  const fetchFileList = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/file/list?directory=./&recursive=false`);
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

  const closeContextMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('#context-menu')) closeContextMenu();
  };

  const handleFileAction = async (action: 'open' | 'delete' | 'create', type?: 'file' | 'folder') => {
    const file = contextMenu().file;
    if (!file) return;

    let payload = { path: file.path };

    if (action === 'open') {
      props.onFileSelect(file.path);
    } else {
      if (action === 'create') {
        const name = prompt(`Enter name for new ${type}:`)?.trim();
        if (!name) return;
        payload = { ...payload, path: `${file.path}/${name}`, type };
      }

      try {
        await api.post(`/file/${action}`, payload);
        fetchFileList();
      } catch (err) {
        alert(`Error: ${(err as Error).message}`);
      }
    }

    closeContextMenu();
  };

  onMount(() => {
    fetchFileList();
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
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
        <For each={fileTree()}>
          {(file) => <FileNode file={file} onSelect={props.onFileSelect} onContextMenu={handleContextMenu} />}
        </For>
      </Show>

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
            <li class="text-sm text-yellow-500 hover:underline cursor-pointer" onClick={() => handleFileAction('open')}>
              Open
            </li>

            <Show when={contextMenu().file!.type === 'folder'}>
              <li
                class="text-sm text-green-600 hover:underline cursor-pointer"
                onClick={() => handleFileAction('create', 'file')}
              >
                ➕ New File
              </li>
              <li
                class="text-sm text-green-600 hover:underline cursor-pointer"
                onClick={() => handleFileAction('create', 'folder')}
              >
                📁 New Folder
              </li>
            </Show>

            <li class="text-sm text-red-500 hover:underline cursor-pointer" onClick={() => handleFileAction('delete')}>
              ❌ Delete
            </li>
          </ul>
        </div>
      </Show>
    </div>
  );
}
