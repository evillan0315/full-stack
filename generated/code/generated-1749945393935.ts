// src/pages/editor.tsx
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
import EditorBottomNav from '../components/editor/EditorBottomNav';

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

  const editorFileHook = useEditorFile(
    (loadedContent) => {
      editorContent.set(loadedContent);

      editorOriginalContent.set(loadedContent);

      const prev = editorUnsaved.get();
      editorUnsaved.set({
        ...prev,
        [editorFilePath.get()]: false,
      });
    },
    () => {
      editorOriginalContent.set(editorContent.get());

      const prev = editorUnsaved.get();
      editorUnsaved.set({
        ...prev,
        [editorFilePath.get()]: false,
      });
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

    const currentPath = editorFilePath.get();
    const unsavedMap = editorUnsaved.get();
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
            onSave={() => {
              editorFileHook.saveFile();
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
            <EditorBottomNav setTerminalOpen={setTerminalOpen} />
          </div>
        </div>
      </div>
    </Show>
  );
}

// src/components/editor/EditorBottomNav.tsx
import { type JSX, createSignal } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import DropdownMenu from '../ui/DropdownMenu';
import { Button } from '../ui/Button';
import { useEditorFile } from '../../hooks/useEditorFile';
import { useCodeTools } from '../../hooks/useCodeTools';
import { showToast } from '../../stores/toast';
import api from '../../services/api';
import { useStore } from '@nanostores/solid';
import RightDrawer from '../ui/RightDrawer';
import GenerateCode from '../GenerateCode';
import GenerateDocumentation from '../GenerateDocumentation'; // Import the new component
import {
  editorFilePath,
  editorUnsaved,
  editorOriginalContent,
  editorContent,
  editorOpenTabs,
  //editorLanguage,
} from '../../stores/editorContent';

interface EditorBottomNavProps {
  setTerminalOpen: (open: boolean) => void;
}

export default function EditorBottomNav(props: EditorBottomNavProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [docDrawerOpen, setDocDrawerOpen] = createSignal(false); // State for documentation drawer
  const $filePath = useStore(editorFilePath);
  const { currentFilePath, saveFile, formatCode } = useEditorFile(
    () => {},
    () => {
      editorOriginalContent.set(editorContent.get());
      const prev = editorUnsaved.get();
      editorUnsaved.set({
        ...prev,
        [editorFilePath.get()]: false,
      });
    },
  );
  const { optimize, analyze, repair } = useCodeTools();
  const [prompt, setPrompt] = createSignal(
    'Create a SolidJS component that displays a user profile card.',
  );
  const [topic, setTopic] = createSignal('SolidJS');
  const [language, setLanguage] = createSignal('ts');
  const [output, setOutput] = createSignal<'markdown' | 'json' | 'html' | 'text'>('text');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [generatedContent, setGeneratedContent] = createSignal('');

  // States for GenerateDocumentation
  const [docTopic, setDocTopic] = createSignal('Authentication Service'); // Initial topic
  const [isComment, setIsComment] = createSignal(false); // Initial topic
  const [docIsLoading, setDocIsLoading] = createSignal(false);
  const [docError, setDocError] = createSignal('');
  const [docGeneratedContent, setDocGeneratedContent] = createSignal('');

  const topicOptions = ['React', 'SolidJS', 'NestJS', 'Vue', 'Angular'];
  const languageOptions = [
    { code: 'ts', label: 'TypeScript' },
    { code: 'js', label: 'JavaScript' },
    { code: 'py', label: 'Python' },
    { code: 'java', label: 'Java' },
  ];

  const handleRemoveComments = async () => {
    setIsLoading(true);
    setError('');
    try {
      const currentContent = editorContent.get();
      const response = await api.post('/utils/remove-code-comment', { content: currentContent });

      if (!response.data) throw new Error('No response from server.');

      const newContent = response.data;
      editorContent.set(newContent);
      editorOriginalContent.set(newContent);
      showToast('Comments removed successfully.', 'success');
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Unknown error'}`, 'error');
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (format: string) => {
    setIsLoading(true);
    setError('');
    try {
      const payload = {
        prompt: prompt() || 'Write a function that returns 42.',
        language: language(),
        output: output(),
        topic: topic(),
      };
      const response = await api.post(`/google-gemini/generate-code`, payload);

      if (!response.data) throw new Error('No response from server.');

      const newContent =
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
      const stripCodeBlock = await api.post(`/utils/strip-code-block`, { content: newContent });
      const newFilePath = `./generated/code/generated-${Date.now()}.${language()}`;
      editorFilePath.set(newFilePath);
      const createFilePayload = {
        filePath: newFilePath,
        isDirectory: false,
        content: stripCodeBlock.data,
        type: 'file',
      };
      const createFile = await api.post(`/file/create`, createFilePayload);
      console.log(createFile.data, 'Created File');
      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { newFilePath } }));
      //setGeneratedContent(stripCodeBlock.data);
      showToast(`Code generation complete and saved in ${createFile.data.message}.`, 'success');
      setDrawerOpen(false);
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Unknown error'}`, 'error');
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDocumentation = async () => {
    setDocIsLoading(true);

    setDocError('');
    try {
      const currentContent = editorContent.get();
      const currentFilePath = editorFilePath.get();

      const newDocPath = currentFilePath.replace(/\.[^/.]+$/, '.md');
      const currentFileName = newDocPath.split('/').pop();
      //const currentLanguage = editorLanguage.get();

      showToast(`Preparing doc generation for ${currentFileName}.`, 'info');
      const payload = {
        codeSnippet: currentContent,
        //language: currentLanguage,
        topic:
          'Documentation should be in markdown format with a clean detailed information about the codeSnippet.',
        isComment: false,
        output: 'markdown',
      };

      const response = await api.post(`/google-gemini/generate-doc`, payload);

      if (!response.data) throw new Error('No response from server.');
      editorFilePath.set(newDocPath);
      const createFilePayload = {
        filePath: newDocPath,
        isDirectory: false,
        content: response.data,
        type: 'file',
      };
      const createFile = await api.post(`/file/create`, createFilePayload);
      console.log(createFile.data, 'Created File');

      document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { newDocPath } }));
      //setGeneratedContent(stripCodeBlock.data);
      showToast(`Code Documentation complete and saved in ${createFile.data.message}.`, 'success');
    } catch (err: any) {
      showToast(`Error: ${err.message || 'Unknown error'}`, 'error');
      setDocError(err.message || 'Unknown error');
    } finally {
      setDocIsLoading(false);
    }
  };

  return (
    <>
      <div class="flex items-center justify-between gap-4 py-2">
        <DropdownMenu
          variant="outline"
          icon="mdi:code"
          items={[
            {
              label: 'Format Code',
              icon: 'mdi:format-align-right',
              onClick: formatCode,
            },
            {
              label: 'Remove Comments',
              icon: 'mdi:code',
              onClick: handleRemoveComments,
            },
          ]}
        />
        <DropdownMenu
          variant="outline"
          icon="mdi:wand"
          items={[
            {
              label: 'Inline Documentation',
              icon: 'mdi:code',
              onClick: handleGenerateDocumentation, // Open documentation drawer
            },
            {
              label: 'Generate Code',
              icon: 'mdi:code',
              onClick: () => setDrawerOpen(true),
            },
            {
              label: 'Optimize Code',
              icon: 'mdi:code-block-braces',
              onClick: optimize,
            },
            {
              label: 'Analyze Code',
              icon: 'mdi:code-block-parentheses',
              onClick: analyze,
            },
            {
              label: 'Repair Code',
              icon: 'mdi:code-tags-check',
              onClick: repair,
            },
          ]}
        />
        <Button variant="outline" onClick={saveFile}>
          <Icon icon="mdi:content-save" width="1.4em" height="1.4em" />
        </Button>
        <Button variant="outline" onClick={() => props.setTerminalOpen(true)}>
          <Icon icon="mdi:code-greater-than-or-equal" width="1.4em" height="1.4em" />
        </Button>
      </div>

      <RightDrawer isOpen={drawerOpen()} onClose={() => setDrawerOpen(false)}>
        <GenerateCode
          prompt={prompt}
          setPrompt={setPrompt}
          topic={topic}
          setTopic={setTopic}
          topicOptions={topicOptions}
          output={output}
          setOutput={setOutput}
          language={language}
          setLanguage={setLanguage}
          languageOptions={languageOptions}
          handleSubmit={handleGenerate}
          loading={isLoading}
          error={error}
          generatedContent={generatedContent()}
        />
      </RightDrawer>

      <RightDrawer isOpen={docDrawerOpen()} onClose={() => setDocDrawerOpen(false)}>
        <GenerateDocumentation
          prompt={editorContent.get()}
          topic={docTopic}
          setTopic={setDocTopic}
          isComment={isComment}
          setIsComment={setIsComment}
          language={language} // Pass language state if needed
          setLanguage={setLanguage}
          handleSubmit={handleGenerateDocumentation}
          loading={docIsLoading}
          error={docError}
          generatedContent={docGeneratedContent()}
        />
      </RightDrawer>
    </>
  );
}
