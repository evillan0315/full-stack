import { createSignal } from 'solid-js';

interface API {
  post: (url: string, payload: any) => Promise<any>;
}

interface ToastOptions {
  duration?: number;
}

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
  duration: number;
}

// Mock implementations - replace with your actual implementations
const api: API = {
  post: async (url: string, payload: any) => {
    console.log(`API Call: ${url}`, payload);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate a successful response
    return Promise.resolve({ data: `Mock response for ${url}` });
  },
};

const showToast = (message: string, type: ToastType = 'info', options?: ToastOptions) => {
  console.log(`Toast: ${message} (${type})`);
  // Simulate toast display, use real implementation instead of console.log
};

const useEditorState = () => {
    const [editorContent, setEditorContent] = createSignal('');
    const [editorFilePath, setEditorFilePath] = createSignal('');
    const [editorLanguage, setEditorLanguage] = createSignal('');
    return { editorContent: {get:editorContent, set:setEditorContent}, editorFilePath: {get:editorFilePath, set:setEditorFilePath}, editorLanguage: {get:editorLanguage, set:setEditorLanguage}}
}

const { editorContent, editorFilePath, editorLanguage } = useEditorState()


const handleGenerateDocumentation = async () => {
  const [docIsLoading, setDocIsLoading] = createSignal(false);
  const [docError, setDocError] = createSignal('');
  //const [generatedContent, setGeneratedContent] = createSignal('');

  setDocIsLoading(true);
  setDocError('');

  try {
    const currentContent = editorContent.get();
    const currentFilePath = editorFilePath.get();

    const newDocPath = currentFilePath.replace(/\.[^/.]+$/, ".md");
    const currentFileName = newDocPath.split("/").pop() || 'unknown';
    //const currentLanguage = editorLanguage.get();

    showToast(`Preparing doc generation for ${currentFileName}.`, 'info');

    const payload = {
      codeSnippet: currentContent,
      //language: currentLanguage,
      topic: 'Documentation should be in markdown format with a clean detailed information about the codeSnippet.',
      isComment: false,
      output: 'markdown'
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

    // Delay dispatchEvent by 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));

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

export default handleGenerateDocumentation;
