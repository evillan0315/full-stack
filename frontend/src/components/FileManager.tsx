// File: src/components/FileManager.tsx
import { createResource, createSignal, For, Show } from 'solid-js';
import api from '../services/api';

type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children: FileItem[]; // Always an array
};

const fetchFileList = async (): Promise<FileItem[]> => {
  const res = await api.get('/file/list?directory=./&recursive=true');
  if (!res.data) throw new Error('Failed to load files');
  return res.data;
};

function buildTree(files: FileItem[]): FileItem[] {
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

const FileNode = (props: { file: FileItem; onSelect: (path: string) => void }) => {
  const [open, setOpen] = createSignal(false);

  const toggle = () => {
    if (props.file.isDirectory) {
      setOpen(!open());
    }
  };

  return (
    <div class="ml-4">
      <Show
        when={props.file.isDirectory && props.file.children.length > 0}
        fallback={
          <div class="cursor-pointer hover:underline" onClick={() => props.onSelect(props.file.path)}>
            📄 {props.file.name}
          </div>
        }
      >
        <div class="cursor-pointer text-yellow-500 font-bold" onClick={toggle}>
          {open() ? '📂' : '📁'} {props.file.name}
        </div>

        <div
          class={`transition-all duration-300 ease-in-out overflow-hidden pl-2 border-l border-neutral-300`}
          classList={{
            'max-h-0 opacity-0 scale-y-[0.95]': !open(),
            'max-h-[1000px] opacity-100 scale-y-100': open(), // large enough max-height
          }}
          style={{
            transformOrigin: 'top',
          }}
        >
          <For each={props.file.children} fallback={null}>
            {(child) => <FileNode file={child} onSelect={props.onSelect} />}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default function FileManager(props: { onFileSelect: (path: string) => void }) {
  const [files] = createResource(fetchFileList);

  return (
    <Show when={files()} fallback={<div>Loading...</div>}>
      <For each={buildTree(files())}>
        {(file) => <FileNode file={file} onSelect={props.onFileSelect} />}
      </For>
    </Show>
  );
}

