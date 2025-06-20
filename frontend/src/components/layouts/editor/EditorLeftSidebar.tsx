import { createSignal, onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../../contexts/AuthContext';
import { useEditorFile } from '../../../hooks/useEditorFile';
import {
  editorOriginalContent,
  editorFilePath,
  editorContent,
  editorUnsaved,
  editorCurrentDirectory,
} from '../../../stores/editorContent';
import FileManagerHeader from '../../../components/file/FileManagerHeader';
import CollapsiblePanel from '../panels/CollapsiblePanel';
import FileManager from '../../../components/file/FileManager';
import { useStore } from '@nanostores/solid';

export default function EditorLeftSidebar() {
  const defaultWidth = 240;
  const minWidth = 100;
  const maxWidth = 400;
  const [width, setWidth] = createSignal(defaultWidth);
  const [isResizing, setIsResizing] = createSignal(false);
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const $editorCurrentDirectory = useStore(editorCurrentDirectory);
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
  console.log(editorFileHook.currentDirectory(), 'editorFileHook.currentDirectory()');
  return (
    <>
      <div class="h-full flex flex-col">
        <CollapsiblePanel
          header={
            <FileManagerHeader
              currentDirectory={$editorCurrentDirectory}
              // Removed navigateUp prop - it's handled internally by FileManagerHeader now
              fetchDirectory={editorFileHook.fetchDirectory}
              handleFileAction={editorFileHook.handleFileAction}
              createFolder={editorFileHook.createFolder}
              createFile={editorFileHook.createFile}
            />
          }
        >
          <FileManager onFileSelect={loadFile} />
        </CollapsiblePanel>
      </div>
    </>
  );
}
