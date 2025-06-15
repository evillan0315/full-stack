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
  const { currentFilePath, saveFile, toggleTerminal, formatCode } = useEditorFile(
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
  const [prompt, setPrompt] = createSignal('Create a SolidJS component that displays a user profile card.');
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
  
  const runBuildApp = async () => {
    console.log('Run build app');
  }
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

      const newContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
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

      //await new Promise((resolve) => setTimeout(resolve, 20000));

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
        topic: 'Documentation should be in markdown format with a clean detailed information about the codeSnippet.',
        isComment: false,
        output: 'text',
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

      //await new Promise((resolve) => setTimeout(resolve, 20000));

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
              label: 'Remove Comments',
              icon: 'mdi:code',
              onClick: handleRemoveComments,
            },
            {
              label: 'Inline Documentation',
              icon: 'mdi:code',
              onClick: handleGenerateDocumentation,
            },
            {
              label: 'Generate Documentation',
              icon: 'mdi:document',
              onClick: () => setDocDrawerOpen(true),
            },
          ]}
        />
        <DropdownMenu
          variant="outline"
          icon="mdi:wand"
          items={[
            {
              label: 'Format Code',
              icon: 'mdi:format-align-right',
              onClick: formatCode,
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
        <DropdownMenu
          variant="outline"
          icon="mdi:code-greater-than-or-equal"
          items={[
            {
              label: 'Run Build App',
              icon: 'mdi:code-block-parentheses',
              onClick: runBuildApp,
            },
            {
              label: 'Open Terminal',
              icon: 'mdi:code-greater-than-or-equal',
              onClick: () => props.setTerminalOpen(true),
            },
          ]}
        />
        <Button variant="outline" onClick={saveFile}>
          <Icon icon="mdi:content-save" width="1.4em" height="1.4em" />
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
          prompt={() => editorContent.get()}
          setPrompt={(val) => editorContent.set(val)}
          topic={topic}
          setTopic={setTopic}
          topicOptions={topicOptions}
          output={output}
          setOutput={setOutput}
          language={language}
          setLanguage={setLanguage}
          languageOptions={languageOptions}
          isComment={isComment}
          setIsComment={setIsComment}
          handleSubmit={handleGenerateDocumentation}
          loading={docIsLoading}
          error={error}
          generatedContent={docGeneratedContent()}
        />
      </RightDrawer>
    </>
  );
}
