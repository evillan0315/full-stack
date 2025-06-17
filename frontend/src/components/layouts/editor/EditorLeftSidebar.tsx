import { createSignal, onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../../contexts/AuthContext';
import { useEditorFile } from '../../../hooks/useEditorFile';
import { editorOriginalContent, editorFilePath, editorContent, editorUnsaved } from '../../../stores/editorContent';
import FileManager from '../../../components/file/FileManager';

export default function EditorLeftSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <div
      id="leftSidebar"
      class="flex flex-col border-r transition-all duration-200"
      //style={{ width: `${width()}px` }}
    >
      <FileManager onFileSelect={(path) => loadFile(path)} />
    </div>
  );
}
