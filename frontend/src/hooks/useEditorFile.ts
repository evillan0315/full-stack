import { createSignal, onCleanup } from 'solid-js';
import api from '../services/api';
import { showToast } from '../stores/toast';
import type { FileItem } from '../types/types';
import {
  editorContent,
  editorFilePath,
  editorLanguage,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorOpenTabs,
} from '../stores/editorContent';

export function useEditorFile(onLoadContent?: (content: string) => void, onSave?: () => void) {
  const [content, setContent] = createSignal('');
  const [currentFilePath, setCurrentFilePath] = createSignal('');
  const [language, setLanguage] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [loadingMessage, setLoadingMessage] = createSignal('');
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');
  const [directoryFiles, setDirectoryFiles] = createSignal<FileItem[]>([]);
  const [currentDirectory, setCurrentDirectory] = createSignal('');
  const [terminalOpen, setTerminalOpen] = createSignal(false);

  let latestRequestId = 0;

  const fetchFile = async (path: string): Promise<void> => {
    if (!path) return;

    const requestId = ++latestRequestId;
    setLoading(true);
    setLoadingMessage(`Loading ${path}...`);
    //showToast(`Loading ${path}...`, 'info');

    try {
      const formData = new FormData();
      formData.append('filePath', path);
      const response = await api.post('/file/read', formData);

      if (latestRequestId !== requestId) {
        console.log(`Stale fetch for ${path} (request ${requestId}), ignoring.`);
        return;
      }

      const code = response.data?.content;
      if (code === undefined || code === null) throw new Error('Empty file content');

      // Update signals + stores
      setContent(code);
      editorContent.set(code);
      editorOriginalContent.set(code);
      editorHistory.set([]);
      editorFuture.set([]);

      editorFilePath.set(path);
      setCurrentFilePath(path);

      const lang = response.data?.language || '';
      setLanguage(lang);
      editorLanguage.set(lang);

      const prev = editorOpenTabs.get();
      const safePrev = Array.isArray(prev) ? prev : [];
      const newTabs = safePrev.includes(path) ? safePrev : [...safePrev, path];
      editorOpenTabs.set(newTabs);

      onLoadContent?.(code);
      //showToast(`Loaded ${path}`, 'success');
    } catch (err) {
      const msg = (err as any).response?.data?.message || (err as Error).message;
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      if (latestRequestId === requestId) {
        setLoading(false);
        setLoadingMessage('');
      }
    }
  };

  const fetchDirectory = async (dirPath: string) => {
    setLoading(true);
    setLoadingMessage(`Loading directory ${dirPath}...`);
    //showToast(`Loading directory ${dirPath}...`, 'info');

    try {
      const query = `?directory=${encodeURIComponent(dirPath || './')}&recursive=true`;
      const response = await api.get(`/file/list${query}`);
      if (!Array.isArray(response.data)) throw new Error('Invalid data format');

      setDirectoryFiles(response.data);
      setCurrentDirectory(dirPath);
    } catch (err) {
      const msg = (err as any).response?.data?.message || (err as Error).message;
      setError(msg);
      showToast(`Error: ${msg}`, 'error');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const saveFile = async () => {
    if (!editorFilePath.get()) {
      showToast('No file path specified', 'error');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('filePath', editorFilePath.get());
      formData.append('content', editorContent.get());
      console.log(editorFilePath.get(), editorContent.get());
      const response = await api.post('/file/write', formData);
      if (!response.data.success) throw new Error('Failed to save file');

      editorOriginalContent.set(content());
      showToast('File saved successfully.', 'success');
      onSave?.();
    } catch (err) {
      const msg = (err as any).response?.data?.message || (err as Error).message;
      showToast(`Error saving file: ${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };
  const formatCode = async () => {
    const code = editorContent.get();
    const lang = editorLanguage.get() || 'javascript'; // fallback
    try {
      showToast('Formatting code...', 'info');
      console.log(code, lang);
      const response = await api.post('/utils/format', {
        code,
        language: lang.toLowerCase(),
      });

      const formatted = response.data;
      if (!formatted) throw new Error('No formatted output');

      setContent(formatted);
      editorContent.set(formatted);
      showToast('Code formatted successfully.', 'success');
    } catch (err) {
      const msg = (err as any).response?.data?.message || (err as Error).message;
      showToast(`Error formatting code: ${msg}`, 'error');
    }
  };
  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen());
  };
  onCleanup(() => {
    // Invalidate all pending requests
    latestRequestId++;
  });

  return {
    currentFilePath,
    setCurrentFilePath,
    content,
    setContent,
    language,
    loading,
    loadingMessage,
    saving,
    error,
    directoryFiles,
    currentDirectory,
    fetchFile,
    fetchDirectory,
    saveFile,
    toggleTerminal,
    terminalOpen,
    formatCode,
  };
}
