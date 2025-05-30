import { createResource, createSignal, For, Show } from 'solid-js';
import api from '../services/api';

type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  type: 'file' | 'folder';
  children: FileItem[];
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

  const isDir = props.file.isDirectory && props.file.children.length > 0;

  const toggle = () => {
    if (isDir) setOpen(!open());
  };

  return (
    <div class="ml-2">
      <div
        class="cursor-pointer font-semibold text-yellow-500"
        onClick={() => (isDir ? toggle() : props.onSelect(props.file.path))}
      >
        {isDir ? (open() ? '📂' : '📁') : '📄'} {props.file.name}
      </div>

      {/* Always render children container, just toggle visibility */}
      <div
        class="pl-3 border-l border-gray-300 transition-all duration-200 origin-top"
        style={{
          display: open() ? 'block' : 'none',
        }}
      >
        <For each={props.file.children}>
          {(child) => <FileNode file={child} onSelect={props.onSelect} />}
        </For>
      </div>
    </div>
  );
};

export default function FileManager(props: { onFileSelect: (path: string) => void }) {
  const [files] = createResource(fetchFileList);

  return (
    <Show when={files()} fallback={<div>Loading...</div>}>
      <For each={buildTree(files())} fallback={<div>No files found.</div>}>
        {(file) => <FileNode file={file} onSelect={props.onFileSelect} />}
      </For>
    </Show>
  );
}

