import { createStore } from 'solid-js/store';
import { createMemo, Show, For, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import api from '../../services/api';
import type { FileItem } from '../../types/types';
import Tooltip from '../../components/ui/Tooltip';

import { useStore } from '@nanostores/solid';
import { editorFilePath, editorOpenTabs, editorUnsaved } from '../../stores/editorContent';

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

interface FileNodeProps {
  file: FileItem;
  onSelect: (path: string, isDirectory: boolean) => void;
  onContextMenu: (e: MouseEvent, file: FileItem) => void;
  onRefresh?: (directory?: string) => void;
}

const FileNode = (props: FileNodeProps) => {
  const [state, setState] = createStore({
    open: false,
    editing: false,
    newName: props.file.name,
    loadingChildren: false,
    children: props.file.children || ([] as FileItem[]),
  });

  const currentIcon = createMemo(() => getFileIcon(props.file.name, props.file.isDirectory, state.open));
  const $openTabs = useStore(editorOpenTabs);
  const $filePath = useStore(editorFilePath);
  const $unsaved = useStore(editorUnsaved);

  const hasChildren = createMemo(() => state.children.length > 0);

  const toggle = async () => {
    if (!props.file.isDirectory) return;
    setState('open', (o) => !o);

    if (!state.open && state.children.length === 0) {
      setState('loadingChildren', true);
      try {
        const res = await api.get(`/file/list?directory=${encodeURIComponent(props.file.path)}`);
        if (Array.isArray(res.data)) {
          setState('children', res.data);
        }
      } catch (err) {
        console.error('Failed to load directory contents:', err);
        alert(`Failed to load contents of ${props.file.name}`);
      } finally {
        setState('loadingChildren', false);
      }
    }
  };
  const handleClick = () => {
    if (props.file.isDirectory) {
      toggle();
    } else {
      const path = props.file.path;

      editorFilePath.set(path);

      // Directly trigger load
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
    }
  };

  const handleRename = async () => {
    const trimmed = state.newName.trim();
    if (!trimmed || trimmed === props.file.name) {
      setState('editing', false);
      return;
    }

    try {
      await api.post('/file/rename', {
        oldPath: props.file.path,
        newPath: `${props.file.path.substring(0, props.file.path.lastIndexOf('/') + 1)}${trimmed}`,
      });
      props.onRefresh?.();
    } catch (err) {
      console.error('Rename failed:', err);
      alert(`Failed to rename: ${(err as any).response?.data?.message || (err as Error).message}`);
      setState('newName', props.file.name);
    } finally {
      setState('editing', false);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      setState({ newName: props.file.name, editing: false });
    }
  };

  onMount(() => {
    setState('newName', props.file.name);
  });

  return (
    <div class="relative">
      <div
        class="cursor-pointer hover:bg-gray-700/10 px-1 rounded flex items-center gap-x-2"
        onClick={handleClick}
        onContextMenu={(e) => props.onContextMenu(e, props.file)}
        onDblClick={() => {
          if (!props.file.isDirectory && !state.editing) {
            setState('editing', true);
          }
        }}
      >
        <Icon width="20" height="20" icon={currentIcon()} />

        <Show
          when={state.editing}
          fallback={
            <>
              <Tooltip html={`<h4>${props.file.name}</h4><p>${props.file.size}</p>`} position="top" offset={2}>
                <span class="truncate max-w-[220px]">{props.file.name}</span>
              </Tooltip>
            </>
          }
        >
          <input
            class="rounded px-1 text-sm flex-grow"
            value={state.newName}
            autofocus
            onInput={(e) => setState('newName', e.currentTarget.value)}
            onBlur={handleRename}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        </Show>

        {props.file.isDirectory && (
          <Icon icon={state.open ? 'mdi:chevron-down' : 'mdi:chevron-right'} class="w-4 h-4 text-gray-500 ml-auto" />
        )}
      </div>

      <Show when={state.open}>
        <div class="pl-2 border-l border-gray-500/30 ml-1">
          <Show when={state.loadingChildren}>
            <div class="text-sm px-2">Loading...</div>
          </Show>
          <For each={state.children}>
            {(child) => (
              <FileNode
                file={child}
                onSelect={props.onSelect}
                onContextMenu={props.onContextMenu}
                onRefresh={props.onRefresh}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default FileNode;
