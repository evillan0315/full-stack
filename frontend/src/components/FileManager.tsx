// File: src/components/FileManager.tsx
import { createResource, createSignal, For, Show } from 'solid-js';
import api from "../services/api";
type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children: FileItem[]; // <- ensure it's always an array
};

const fetchFileList = async (): Promise<FileItem[]> => {
  const res = await api.get("/file/list?directory=./&recursive=true");
  console.log(res.data, 'res');
  if (!res.data) throw new Error('Failed to load files');
  return res.data;
};

function buildTree(files: FileItem[]): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  for (const file of files) {
    console.log(file, 'file');
    map.set(file.path, { ...file, children: file.children });
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
  console.log(props.file, props.file.isDirectory);
  const toggle = () => {
    if (props.file.isDirectory && props.file.children.length > 0) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div class="ml-4">
      <Show when={props.file.isDirectory} fallback={
        <div
          class="cursor-pointer hover:underline"
          onClick={() => props.onSelect(props.file.path)}
        >
          📄 {props.file.name}
        </div>
      }>
        <div
          class="cursor-pointer text-blue-600"
          onClick={toggle}
        >
          {open() ? '📂' : '📁'} {props.file.name}
        </div>
        <Show when={open()}>
          <For each={props.file.children}>
            {(child) => (
              <FileNode file={child} onSelect={props.onSelect} />
            )}
          </For>
        </Show>
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

