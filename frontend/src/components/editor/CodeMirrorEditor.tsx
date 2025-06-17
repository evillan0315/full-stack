import { createEffect, onCleanup } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import {
  editorContent,
  editorFilePath,
  editorUnsaved,
  editorOriginalContent,
  editorHistory,
  editorFuture,
} from '../../stores/editorContent';
import { theme } from '../../stores/theme';
import { useEditorKeybindings } from '../../hooks/useEditorKeybindings'; 
interface CodeMirrorEditorProps {
  onChange?: (content: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export default function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  let container: HTMLDivElement | undefined;
  let view: EditorView | null = null;

  const $theme = useStore(theme);
  const $content = useStore(editorContent);
  const $filePath = useStore(editorFilePath);

  const themeCompartment = new Compartment();
  const langCompartment = new Compartment();
  useEditorKeybindings(props.onSave);
  const initialize = (code: string) => {
    if (view) view.destroy();

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langCompartment.of(detectLanguage($filePath())),
        themeCompartment.of(getThemeExtension($theme())),
        EditorView.lineWrapping,
        EditorView.editable.of(!props.readOnly),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            const newCode = v.state.doc.toString();
            editorContent.set(newCode);
            props.onChange?.(newCode);

            // Track unsaved status
            editorUnsaved.set({
              ...editorUnsaved.get(),
              [$filePath()]: newCode !== editorOriginalContent.get(),
            });

            // Update history (append new state)
            const history = editorHistory.get();
            editorHistory.set([...history, newCode]);
            editorFuture.set([]); // Clear future on new edit
          }
        }),
      ],
    });

    view = new EditorView({
      state,
      parent: container!,
    });
  };

  createEffect(() => {
    if (container && !view) {
      initialize($content());
    }
  });

  createEffect(() => {
    if (view) {
      const current = view.state.doc.toString();
      const incoming = $content();
      if (current !== incoming) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: incoming },
        });
      }
    }
  });

  createEffect(() => {
    if (view) {
      view.dispatch({
        effects: [
          langCompartment.reconfigure(detectLanguage($filePath())),
          themeCompartment.reconfigure(getThemeExtension($theme())),
        ],
      });
    }
  });

  onCleanup(() => {
    view?.destroy();
    view = null;
  });

  return (
    <div id="editorContainer" class="flex-1 overflow-auto">
      <div id="editor" ref={container} class="h-full" />
    </div>
  );
}
