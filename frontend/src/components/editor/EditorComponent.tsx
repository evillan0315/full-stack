import { createEffect, onMount, onCleanup, type JSX } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';

import { theme } from '../../stores/theme';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import { undoEdit, redoEdit } from '../../utils/editorUndoRedo';
import { editorContent, editorFilePath } from '../../stores/editorContent';

type EditorComponentProps = {
  onSave?: () => void;
  onChange?: (content: string) => void;
};

const EditorComponent = (props: EditorComponentProps): JSX.Element => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const $theme = useStore(theme);
  const $content = useStore(editorContent);
  const $filePath = useStore(editorFilePath);

  const themeCompartment = new Compartment();
  const langCompartment = new Compartment();

  // Initialize editor
  createEffect(() => {
    if (editorContainer && !editorView) {
      editorView = new EditorView({
        state: EditorState.create({
          doc: $content(),
          extensions: [
            basicSetup,
            langCompartment.of(detectLanguage($filePath())),
            themeCompartment.of(getThemeExtension($theme())),
            EditorView.lineWrapping,
            EditorView.updateListener.of((v) => {
              if (v.docChanged) {
                const newCode = v.state.doc.toString();
                editorContent.set(newCode);
                props.onChange?.(newCode);
              }
            }),
          ],
        }),
        parent: editorContainer,
      });
    }
  });

  // Update content dynamically
  createEffect(() => {
    if (editorView) {
      const current = editorView.state.doc.toString();
      if (current !== $content()) {
        editorView.dispatch({
          changes: { from: 0, to: current.length, insert: $content() },
        });
      }
    }
  });

  // Clear content when no file is open
  createEffect(() => {
    if (editorView && !$filePath()) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: '' },
      });
    }
  });

  // Update language dynamically
  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: langCompartment.reconfigure(detectLanguage($filePath())),
      });
    }
  });

  // Update theme dynamically
  createEffect(() => {
    if (editorView) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  // Handle shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      props.onSave?.();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoEdit();
    } else if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
    ) {
      e.preventDefault();
      redoEdit();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    editorView?.destroy();
    editorView = null;
    window.removeEventListener('keydown', handleKeyDown);
  });

  return (
  <Show
      when={$filePath}
      fallback={
        <div class="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No file open. Select a file from the explorer.
        </div>
      }
    >
    <div class="h-screen flex flex-col overflow-auto relative">
      <div ref={(el) => (editorContainer = el)} class="h-full w-full" />
    </div>
    </Show>
  );
};

export default EditorComponent;

