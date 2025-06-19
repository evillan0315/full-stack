// src/components/layouts/panels/EditorRightSidebar.tsx
import { Show, onMount, createSignal, onCleanup } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../../contexts/AuthContext';
import MarkdownViewer from '../../MarkdownViewer';
import CollapsiblePanel from '../panels/CollapsiblePanel';

import FileManager from '../../../components/file/FileManager';
import { useEditorFile } from '../../../hooks/useEditorFile';
import {
  editorOriginalContent,
  editorFilePath,
  editorContent,
  editorUnsaved,
  editorLanguage,
} from '../../../stores/editorContent';
export default function EditorRightSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const $editorLanguage = useStore(editorLanguage);
  const $editorContent = useStore(editorContent);
  const editorFileHook = useEditorFile(
    (loadedContent) => {
      editorContent.set(loadedContent);
      editorOriginalContent.set(loadedContent);
      editorUnsaved.set({
        ...editorUnsaved.get(),
        [editorFilePath.get()]: false,
      });
    },
    () => {
      editorOriginalContent.set(editorContent.get());
      editorUnsaved.set({
        ...editorUnsaved.get(),
        [editorFilePath.get()]: false,
      });
    },
  );

  const loadFile = (path: string) => {
    if (!path) return;
    editorFilePath.set(path);
    editorFileHook.fetchFile(path);
  };

  const handleEditorLoadFile = (e: Event) => {
    const path = (e as CustomEvent).detail.path;
    loadFile(path);
  };
  onMount(() => {
    document.addEventListener('editor-load-file', handleEditorLoadFile);

    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (editorFilePath.get()) {
      loadFile(editorFilePath.get());
    }
  });

  onCleanup(() => {
    document.removeEventListener('editor-load-file', handleEditorLoadFile);
  });
  return (
    <div class="flex flex-col">
      <Show when={$editorLanguage() === 'markdown'}>
        <CollapsiblePanel header="Markdown Preview">
          <MarkdownViewer content={$editorContent()} />
        </CollapsiblePanel>
      </Show>
      <CollapsiblePanel header="References">
        <div class="p-2 text-sm text-gray-400">References content goes here</div>
      </CollapsiblePanel>
    </div>
  );
}
