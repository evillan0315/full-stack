import { createSignal, onMount, onCleanup, createEffect, Show } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { Icon } from '@iconify-icon/solid';
import { detectLanguage } from '../utils/editorLanguage';
import { getThemeExtension, getTheme } from '../utils/editorTheme';

import { theme, toggleTheme } from '../stores/theme';
import { useStore } from '@nanostores/solid';

import api from '../services/api';
import { showToast } from '../stores/toast';
import Loading from './Loading';

/**
 * Defines the properties for the EditorComponent.
 */
type EditorComponentProps = {
  /**
   * Optional parameter specifying the method to retrieve the file.
   * Can be 'url' or 'filePath'. Defaults to 'filePath' if not provided when calling the file API.
   */
  param?: 'url' | 'filePath';
  /**
   * The path to the file to be edited. This is required.
   */
  filePath: string;
  /**
   * Optional initial content to populate the editor with. If not provided, the file will be fetched from the server.
   */
  initialContent?: string;
  /**
   * Optional boolean indicating whether the component is currently loading data.
   */
  isLoading?: boolean;
  /**
   * Optional function to trigger the generation of documentation for the code.
   */
  generateDocs?: () => void;
};

/**
 * A code editor component built with CodeMirror 6.
 *
 * This component allows editing of files, saving changes, and dynamically updating the editor theme.
 * It also supports generating documentation from the code snippet.
 *
 * @param props - The properties for configuring the editor.
 * @returns A SolidJS component that renders a code editor.
 */
const EditorComponent = (props: EditorComponentProps) => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;
  let aiMenuRef: HTMLDivElement | undefined;
  const $theme = useStore(theme);

  const [content, setContent] = createSignal('');
  const [language, setLanguage] = createSignal('');
  const [loading, setLoading] = createSignal(true);
  const [loadingMessage, setLoadingMessage] = createSignal('Loading');
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal('');
  const [contextMenuPos, setContextMenuPos] = createSignal<{ x: number; y: number } | null>(null);
  const [showAIMenu, setShowAIMenu] = createSignal(false);
  const [showCodeMenu, setShowCodeMenu] = createSignal(false);
  // This compartment allows us to reconfigure the theme dynamically
  const themeCompartment = new Compartment();

  /**
   * Initializes the CodeMirror editor with the provided code and applies the current theme.
   * Destroys any existing editor instance before creating a new one.
   *
   * @param code - The initial code to populate the editor with.
   */
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

  /**
   * Reactively updates the CodeMirror editor's theme in real-time whenever the global theme changes.
   */
  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  /**
   * Asynchronously generates inline documentation for the current code in the editor.
   * It sends the code snippet and language to an API endpoint, retrieves the generated documentation,
   * and updates the editor content with the documentation.
   */
  const generateDocumentation = async () => {
    setShowAIMenu(false);
    setLoading(true);
    setLoadingMessage(`Generating inline code documentations for ${props.filePath}...`);
    try {
      const payload = {
        codeSnippet: content(),
        language: language(),
        output: 'text',
        isComment: true,
      };

      const response = await api.post('/google-gemini/generate-doc', payload);

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Invalid documentation format received from API');
      }

      // Strip triple backticks and language tag if present
      const cleanedContent = await api.post('/utils/strip-code-block', { content: response.data });
      const concatenatedWithFilePath = `// File: ${props.filePath}\n\n${cleanedContent.data}`;
      setContent(concatenatedWithFilePath);
      initEditor(concatenatedWithFilePath);
    } catch (err) {
      console.error('Error generating documentation:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  /**
   * Asynchronously fetches the file content from the server based on the provided file path.
   * It updates the editor with the fetched content and sets the language based on the file extension.
   * Displays a toast message and updates the error state if fetching fails.
   */
  const fetchFile = async () => {
    setLoading(true);
    setLoadingMessage(`Removing comments from a code file ${props.filePath}...`);
    try {
      const formData = new FormData();
      formData.append(props.param ?? 'filePath', props.filePath);
      const response = await api.post('/file/read', formData);

      const code = response.data?.content;
      if (!code) throw new Error('Failed to load file');

      setContent(code);
      setLanguage(response.data?.language);
      initEditor(code);
    } catch (err) {
      showToast((err as Error).message, 'error');
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  /**
   * Asynchronously saves the current content of the editor to the server.
   * It sends the file path and content to an API endpoint and displays a toast message
   * to indicate success or failure.
   */
  const saveFile = async () => {
    setSaving(true);
    try {
      if (props.param !== 'filePath') {
        //throw new Error('Only internal files from the server can be saved');
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
  const removeCodeComments = async () => {
    setLoading(true);

    try {
      const payload = {
        content: content(),
      };

      const response = await api.post('/utils/remove-code-comment', payload);

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Invalid documentation format received from API');
      }
      const format = await api.post('/utils/format', { code: response.data, language: language() });
      setContent(format.data);
      initEditor(format.data);
    } catch (err) {
      console.error('Error generating documentation:', err);
    } finally {
      setLoading(false);
    }
  };
  const formatCode = async () => {
    setLoading(true);

    try {
      const payload = { code: content(), language: language() };

      const response = await api.post('/utils/format', payload);

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Invalid documentation format received from API');
      }
      setContent(response.data);
      initEditor(response.data);
    } catch (err) {
      console.error('Error generating documentation:', err);
    } finally {
      setLoading(false);
    }
  };
  /**
   * Handles the context menu event, preventing the default browser context menu from appearing
   * and setting the position of a custom context menu.
   *
   * @param e - The MouseEvent triggered by the context menu.
   */
  const handleContextMenu = (e: MouseEvent) => {
    if (!editorContainer?.contains(e.target as Node)) return;
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  /**
   * Closes the custom context menu by setting its position to null.
   */
  const handleGlobalClick = () => setContextMenuPos(null);

  /**
   * Handles the keydown event, specifically the Ctrl/Cmd + S shortcut for saving the file.
   * Prevents the default browser save behavior and calls the saveFile function.
   *
   * @param e - The KeyboardEvent triggered by the keydown.
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveFile();
    }
  };
  const handleOutsideClick = (e: MouseEvent) => {
    if (showAIMenu() && aiMenuRef && !aiMenuRef.contains(e.target as Node)) {
      setShowAIMenu(false);
      setShowCodeMenu(false);
    } else if (showCodeMenu() && aiMenuRef && !aiMenuRef.contains(e.target as Node)) {
      setShowCodeMenu(false);
      setShowAIMenu(false);
    }
  };
  /**
   * Lifecycle hook that runs after the component mounts.
   * It sets up event listeners for context menu, global click, and save shortcut, and fetches the file content.
   */
  onMount(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('click', handleOutsideClick); // 👈 added
    window.addEventListener('keydown', handleKeyDown);

    fetchFile();

    // cleanup added handler too
    onCleanup(() => {
      editorView?.destroy();
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('click', handleOutsideClick); // 👈 added
      window.removeEventListener('keydown', handleKeyDown);
    });
  });

  /**
   * Reactively fetches the file content when the filePath prop changes.
   * This ensures that the editor always displays the correct content for the current file.
   */
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
      <Show when={loading()}>
        <div class="fixed bottom-10 right-0 z-60 ">
          <div class="flex items-center justify-center text-sky-500 text-lg gap-2">
            <Icon icon="line-md:loading-twotone-loop" class={``} /> {loadingMessage()}
          </div>
        </div>
      </Show>

      <Show
        when={['typescript', 'javascript', 'python'].some((lang) =>
          language()?.toLowerCase().includes(lang),
        )}
      >
        <div class="fixed -bottom-2 right-8 z-60">
          <div ref={aiMenuRef} class="relative">
            <button
              title="Code Utility"
              onClick={() => {
                setShowCodeMenu((prev) => !prev);
                setShowAIMenu(false);
              }}
              class="py-2 px-1 shadow-lg cursor-pointer"
            >
              <Icon icon="mdi:code" width="1.4em" height="1.4em" />
            </button>
            <button
              title="Generate Documentation"
              onClick={() => {
                setShowAIMenu((prev) => !prev);
                setShowCodeMenu(false);
              }}
              class="py-2 px-1 shadow-lg cursor-pointer"
            >
              <Icon icon="mdi:wand" width="1.4em" height="1.4em" />
            </button>
            <Show when={showCodeMenu()}>
              <div class="dropdown-menu absolute bottom-full mb-2 right-0 border shadow-md rounded w-48">
                <ul class="text-sm">
                  <li
                    class="flex items-center justify-start gap-2 px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={formatCode}
                  >
                    <Icon icon="mdi:format-align-right" width="1.4em" height="1.4em" /> Format Code
                  </li>
                  <li
                    class="flex items-center justify-start  gap-2 px-4 py-2 hover:bg-gray-500/10  cursor-pointer"
                    onClick={removeCodeComments}
                  >
                    <Icon icon="mdi:code" width="1.4em" height="1.4em" /> Remove Comments
                  </li>
                </ul>
              </div>
            </Show>
            <Show when={showAIMenu()}>
              <div class="dropdown-menu absolute bottom-full mb-2 right-0 border shadow-md rounded w-58">
                <ul class="text-sm">
                  <li
                    class="flex items-center justify-start gap-2  px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={generateDocumentation}
                  >
                    <Icon icon="mdi:code" width="2em" height="2em" /> Code Inline Documentation
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-500/10  cursor-pointer">
                    Optimize Code (Coming soon)
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-500/10  cursor-pointer">
                    Analyze Code (Coming soon)
                  </li>
                  <li class="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
                    Repair Code (Coming soon)
                  </li>
                </ul>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default EditorComponent;
