import { createSignal, onMount, onCleanup, createEffect, Show } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension, getTheme } from '../utils/editorTheme';

import { theme, toggleTheme } from '../stores/theme';
import { useStore } from '@nanostores/solid';

import api from '../services/api';
import { showToast } from '../stores/toast';
import Loading from './Loading';

type EditorComponentProps = {
  param?: 'url' | 'filePath';
  filePath: string;
  initialContent?: string; // <-- ADD THIS LINE
  isLoading?: boolean;    // <-- ADD THIS LINE
};

const EditorComponent = (props: EditorComponentProps) => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;
  const $theme = useStore(theme);

  const [content, setContent] = createSignal('');
  const [loading, setLoading] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');
  const [contextMenuPos, setContextMenuPos] = createSignal<{ x: number; y: number } | null>(null);

  // This compartment allows us to reconfigure the theme dynamically
  const themeCompartment = new Compartment();

  /** Initializes the editor with content and theme */
  const initEditor = (code: string) => {
    if (editorView) editorView.destroy();

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        detectLanguage(props.filePath),
        themeCompartment.of(getThemeExtension($theme())),
        EditorView.lineWrapping,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            setContent(v.state.doc.toString());
          }
        }),
      ],
    });

    editorView = new EditorView({
      state,
      parent: editorContainer!,
    });
  };

  /** Reactively update the theme in real-time */
  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  /** Fetch file content */
  const fetchFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(props.param ?? 'filePath', props.filePath);
      const response = await api.post('/file/read', formData);

      const code = response.data?.data;
      if (!code) throw new Error('Failed to load file');

      setContent(code);
      initEditor(code);
    } catch (err) {
      showToast((err as Error).message, 'error');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /** Save current content to the server */
  const saveFile = async () => {
    setSaving(true);
    try {
      if (props.param !== 'filePath') {
        throw new Error('Only internal files from the server can be saved');
      }

      const formData = new FormData();
      formData.append('filePath', props.filePath);
      formData.append('content', content());

      const response = await api.post('/file/write', formData);
      if (!response.data.success) throw new Error('Failed to save file');

      showToast('File saved successfully.', 'success');
    } catch (err) {
      showToast(`Error saving file: ${(err as Error).message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  /** Context menu handler */
  const handleContextMenu = (e: MouseEvent) => {
    if (!editorContainer?.contains(e.target as Node)) return;
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleGlobalClick = () => setContextMenuPos(null);

  /** Save shortcut handler */
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveFile();
    }
  };

  /** Lifecycle setup */
  onMount(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    fetchFile();
  });

  onCleanup(() => {
    editorView?.destroy();
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('click', handleGlobalClick);
    window.removeEventListener('keydown', handleKeyDown);
  });

  /** Watch filePath prop change */
  let lastFilePath = '';
  createEffect(() => {
    if (props.filePath !== lastFilePath) {
      lastFilePath = props.filePath;
      fetchFile();
    }
  });

  return (
    <div class="bg-gray-950 h-screen flex flex-col overflow-auto relative">
      {/* Optionally re-enable this */}
      {/* loading() && (
        <div class="h-[calc(100vh-8rem)]">
          <Loading position="center" />
        </div>
      ) */}
      <div ref={editorContainer} class="h-full w-full" />
    </div>
  );
};

export default EditorComponent;
