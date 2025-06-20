import { createSignal, createMemo, onCleanup } from 'solid-js';

import { useStore } from '@nanostores/solid';
import { showToast } from '../stores/toast';
import api from '../services/api';
import type { FileItem } from '../types/types';

import {
  editorContent,
  editorFilePath,
  editorLanguage,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorOpenTabs,
  editorUnsaved,
  editorCurrentDirectory,
  editorOpenedDirectories,
  editorFilesDirectories,
} from '../stores/editorContent';

import { confirmDiscardIfUnsaved } from '../utils/editorUnsaved';

export function useEditorFile(onLoadContent?: (content: string) => void, onSave?: () => void) {
  const [content, setContent] = createSignal('');
  const [currentFilePath, setCurrentFilePath] = createSignal('');
  const [language, setLanguage] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [loadingMessage, setLoadingMessage] = createSignal('');
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');
  const [directoryFiles, setDirectoryFiles] = createSignal<FileItem[]>([]);

  const $editorCurrentDirectory = useStore(editorCurrentDirectory);
  const $editorOpenedDirectories = useStore(editorOpenedDirectories);

  let latestRequestId = 0;

  const fetchFile = async (path: string): Promise<void> => {
    if (!path) return;

    const canProceed = await confirmDiscardIfUnsaved(editorFilePath.get());
    if (!canProceed) {
      showToast('File load cancelled.', 'info');
      return;
    }

    const requestId = ++latestRequestId;
    setLoading(true);
    setLoadingMessage(`Loading ${path}...`);

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
    try {
      const query = `?directory=${encodeURIComponent(dirPath || '/')}`;
      const response = await api.get(`/file/list${query}`);
      if (!Array.isArray(response.data)) throw new Error('Invalid data format');
      console.log(response.data, dirPath);

      editorFilesDirectories.set(response.data);
      editorCurrentDirectory.set(dirPath);
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

      const response = await api.post('/file/write', formData);
      if (!response.data.success) throw new Error('Failed to save file');

      editorOriginalContent.set(editorContent.get());
      showToast('File saved successfully.', 'success');

      const currentPath = editorFilePath.get();
      const currentUnsaved = editorUnsaved.get();
      editorUnsaved.set({
        ...currentUnsaved,
        [currentPath]: false,
      });
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
    const lang = editorLanguage.get() || 'javascript';
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

  const createFile = async (directory: string, fileName: string, content?: string) => {
    const filePath = `${directory}/${fileName}`;
    setLoading(true);
    setLoadingMessage(`Creating file ${fileName}...`);

    try {
      await api.post('/file/create', { filePath, isDirectory: false, content: content || '' });
      showToast(`File '${fileName}' created.`, 'success');
      await fetchDirectory(directory);
      await fetchFile(filePath);
    } catch (error) {
      const msg = (error as any).response?.data?.message || (error as Error).message;
      showToast(`Error creating file: ${msg}`, 'error');
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const createFolder = async (directory: string, folderName: string) => {
    const folderPath = `${directory}/${folderName}`;
    setLoading(true);
    setLoadingMessage(`Creating folder ${folderName}...`);
    try {
      await api.post('/file/create', { filePath: folderPath, isDirectory: true });
      showToast(`Folder '${folderName}' created.`, 'success');
      await fetchDirectory(directory);
    } catch (error) {
      const msg = (error as any).response?.data?.message || (error as Error).message;
      showToast(`Error creating folder: ${msg}`, 'error');
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const deleteFileOrFolder = async (filePath: string) => {
    setLoading(true);
    setLoadingMessage(`Deleting ${filePath}...`);
    try {
      await api.post('/file/delete', { filePath });
      showToast(`'${filePath}' deleted.`, 'success');

      await fetchDirectory(editorCurrentDirectory.get());

      if (editorFilePath.get() === filePath) {
        editorFilePath.set('');
        editorContent.set('');
        editorOriginalContent.set('');
        editorLanguage.set('');
        editorHistory.set([]);
        editorFuture.set([]);

        editorOpenTabs.set(editorOpenTabs.get().filter((tab) => tab !== filePath));
        const updatedUnsaved = { ...editorUnsaved.get() };
        delete updatedUnsaved[filePath];
        editorUnsaved.set(updatedUnsaved);
      }
    } catch (error) {
      const msg = (error as any).response?.data?.message || (error as Error).message;
      showToast(`Error deleting: ${msg}`, 'error');
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  onCleanup(() => {
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
    directoryFiles: directoryFiles,

    currentDirectory: $editorCurrentDirectory,

    fetchFile,
    fetchDirectory,
    saveFile,
    formatCode,
    createFile,
    createFolder,
    deleteFileOrFolder,
  };
}
