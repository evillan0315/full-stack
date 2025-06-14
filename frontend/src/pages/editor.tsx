import { createSignal, onMount, Show, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';

import DropdownMenu from '../components/ui/DropdownMenu';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import GridResizer from '../components/GridResizer';
import TerminalDrawer from '../components/TerminalDrawer';
import { EditorStatusBar } from '../components/editor/EditorStatusBar';

import {
  editorOriginalContent,
  editorFilePath,
  editorOpenTabs,
  editorContent,
  editorUnsaved,
} from '../stores/editorContent';
import { showToast } from '../stores/toast';

import FileTabs from '../components/file/FileTabs';
import { useEditorFile } from '../hooks/useEditorFile';
import EditorComponent from '../components/editor/EditorComponent';
import FileManagerContainer from '../components/file/FileManagerContainer';

export default function Editor() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [terminalOpen, setTerminalOpen] = createSignal(false);
  const [left, setLeft] = createSignal(0.225);

  let gridRef: HTMLDivElement | undefined;
  let resizerRef: HTMLDivElement | undefined;

  // ✅ Initialize useEditorFile ONCE at the component level
  const editorFileHook = useEditorFile(
    (loadedContent) => {
      editorContent.set(loadedContent);

      // Update original content so isDirty becomes false
      editorOriginalContent.set(loadedContent);

      const prev = editorUnsaved.get();
      editorUnsaved.set({
        ...prev,
        [editorFilePath.get()]: false,
      });
      //showToast(`Loaded ${editorFilePath.get()}`, 'success');
    },
    () => {
      // After save, original content matches saved content
      editorOriginalContent.set(editorContent.get());

      const prev = editorUnsaved.get();
      editorUnsaved.set({
        ...prev,
        [editorFilePath.get()]: false,
      });
      //showToast(`Saved ${editorFilePath.get()}`, 'success');
    },
  );

  const changeLeft = (clientX: number) => {
    if (!gridRef || !resizerRef) return;
    const rect = gridRef.getBoundingClientRect();
    const position = clientX - rect.left - resizerRef.offsetWidth / 2;
    const size = rect.width - resizerRef.offsetWidth;
    const percentage = Math.min(Math.max(position / size, 0.1), 0.75);
    setLeft(percentage);
  };

  const loadFile = (path: string) => {
    if (!path) return;

    editorFilePath.set(path);
    editorFileHook.fetchFile(path);
  };

  const handleTabClick = (path: string) => {
    if (path !== editorFilePath.get()) {
      loadFile(path);
    }
  };

  const handleTabClose = (closedPath: string) => {
    const remainingTabs = editorOpenTabs.get().filter((t) => t !== closedPath);
    editorOpenTabs.set(remainingTabs);

    if (editorFilePath.get() === closedPath) {
      if (remainingTabs.length > 0) {
        loadFile(remainingTabs[remainingTabs.length - 1]);
      } else {
        editorFilePath.set('');
        editorContent.set('');
      }
    }
  };
  onMount(() => {
    document.addEventListener('editor-load-file', (e: Event) => {
      const path = (e as CustomEvent).detail.path;
      loadFile(path);
    });

    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const initial = editorFilePath.get();
    loadFile(initial);
  });

  onCleanup(() => {
    document.removeEventListener('editor-load-file', () => {});
  });

  return (
    <Show when={isAuthenticated()} fallback={<div>Please Login</div>}>
      <div
        ref={(el) => (gridRef = el)}
        class="flex h-[calc(100vh-5rem)] min-h-0 flex-1 flex-col font-sans dark md:flex-row"
      >
        <FileManagerContainer left={left} loadFile={loadFile} />
        <GridResizer ref={(el) => (resizerRef = el)} isHorizontal={false} onResize={changeLeft} />
        
        <div class="flex min-h-0 min-w-0 flex-col" style={`flex: ${1 - left()}`}>
        
          <FileTabs />
          
          <EditorComponent
            //content={editorContent.get()}
            //filePath={editorFilePath.get()}
            onSave={() => {
              editorFileHook.saveFile();

              // Update the original content so isDirty recomputes to false
              editorOriginalContent.set(editorContent.get());
              const prev = editorUnsaved.get();
              editorUnsaved.set({
                ...prev,
                [editorFilePath.get()]: false,
              });
            }}
            onChange={(content) => {
              editorFileHook.setContent(content);
              editorContent.set(content);

              const prev = editorUnsaved.get();
              editorUnsaved.set({
                ...prev,
                [editorFilePath.get()]: true,
              });
            }}
          />

          <Show when={terminalOpen()}>
            <TerminalDrawer
              isOpen={terminalOpen()}
              setIsOpen={setTerminalOpen}
              position="bottom"
              size="200px"
              fontSize={12}
              resizable
              draggable={false}
            />
          </Show>

          <div class="editor-footer flex items-center justify-between border-t px-6">
            <EditorStatusBar />

            <div class="flex items-center justify-between gap-4 py-2">
              <DropdownMenu
                variant="outline"
                icon="mdi:code"
                items={[
                  { label: 'Format Code', icon: 'mdi:format-align-right', onClick: () => showToast('Format', 'info') },
                  { label: 'Remove Comments', icon: 'mdi:code', onClick: () => showToast('Remove comments', 'info') },
                ]}
              />
              <DropdownMenu
                icon="mdi:wand"
                variant="outline"
                items={[
                  { label: 'Inline Documentation', icon: 'mdi:code', onClick: () => showToast('Doc', 'info') },
                  {
                    label: 'Optimize Code',
                    icon: 'mdi:code-block-braces',
                    onClick: () => showToast('Optimize', 'info'),
                  },
                  {
                    label: 'Analyze Code',
                    icon: 'mdi:code-block-parentheses',
                    onClick: () => showToast('Analyze', 'info'),
                  },
                  { label: 'Repair Code', icon: 'mdi:code-tags-check', onClick: () => showToast('Repair', 'info') },
                ]}
              />
              <Button variant="outline" onClick={() => editorFileHook.saveFile()}>
                <Icon icon="mdi:content-save" width="1.4em" height="1.4em" />
              </Button>
              <Button variant="outline" onClick={() => setTerminalOpen(!terminalOpen())}>
                <Icon icon="mdi:code-greater-than-or-equal" width="1.4em" height="1.4em" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
