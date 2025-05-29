import { Component, createEffect, onMount, onCleanup } from 'solid-js';
import { Uri, languages, editor as mEditor, KeyMod, KeyCode } from 'monaco-editor';
import { throttle } from '@solid-primitives/scheduled';

const Editor: Component<{
  model: mEditor.ITextModel;
  disabled?: boolean;
  isDark?: boolean;
  withMinimap?: boolean;
  formatter?: Worker;
  linter?: Worker;
  displayErrors?: boolean;
  onDocChange?: (code: string) => void;
  onEditorReady?: (
    editor: mEditor.IStandaloneCodeEditor,
    monaco: {
      Uri: typeof Uri;
      editor: typeof mEditor;
    },
  ) => void;
  onSave?: (code: string) => void;
}> = (props) => {
  let parent!: HTMLDivElement;
  let editor: mEditor.IStandaloneCodeEditor | undefined;

  const runLinter = throttle((code: string) => {
    if (props.linter && props.displayErrors) {
      props.linter.postMessage({ event: 'LINT', code });
    }
  }, 250);

  // Formatter setup
  onMount(() => {
    if (props.formatter) {
      languages.registerDocumentFormattingEditProvider('typescript', {
        async provideDocumentFormattingEdits(model) {
          props.formatter!.postMessage({
            event: 'FORMAT',
            code: model.getValue(),
            pos: editor?.getPosition(),
          });

          return new Promise((resolve) => {
            const listener = ({ data }: MessageEvent) => {
              if (data?.code) {
                resolve([
                  {
                    range: model.getFullModelRange(),
                    text: data.code,
                  },
                ]);
              }
            };
            props.formatter!.addEventListener('message', listener, { once: true });
          });
        },
      });
    }
  });

  // Linter setup
  onMount(() => {
    if (props.linter && props.displayErrors) {
      const listener = ({ data }: MessageEvent<any>) => {
        if (!editor) return;

        if (data.event === 'LINT') {
          mEditor.setModelMarkers(props.model, 'eslint', data.markers);
        } else if (data.event === 'FIX') {
          mEditor.setModelMarkers(props.model, 'eslint', data.markers);
          if (data.fixed) props.model.setValue(data.output);
        }
      };

      props.linter.addEventListener('message', listener);
      onCleanup(() => props.linter?.removeEventListener('message', listener));
    }
  });

  // Monaco Editor setup
  onMount(() => {
    editor = mEditor.create(parent, {
      model: null,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      automaticLayout: true,
      readOnly: props.disabled,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 3,
      padding: { top: 15 },
      minimap: {
        enabled: props.withMinimap,
      },
    });

    // Bind linter fix action
    if (props.linter) {
      editor.addAction({
        id: 'eslint.executeAutofix',
        label: 'Fix all auto-fixable problems',
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 3.5,
        run: (ed) => {
          const code = ed.getValue();
          props.linter?.postMessage({ event: 'FIX', code });
        },
      });
    }

    // Save command (Ctrl/Cmd + S)
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
      if (!editor) return;

      const code = editor!.getValue();
      console.log(code, 'Save command (Ctrl/Cmd + S)');
      // Optional: format
      //editor.getAction('editor.action.formatDocument')?.run();
      //props.displayErrors && editor.getAction('eslint.executeAutofix')?.run();
      // Save callback
      props.onSave?.(code);
      editor.focus();
    });

    // Code change handling
    editor.onDidChangeModelContent(() => {
      const code = editor!.getValue();
      props.onDocChange?.(code);
      runLinter(code);
    });

    // Notify parent when ready
    props.onEditorReady?.(editor, { Uri, editor: mEditor });
  });

  // Clean up editor on component destroy
  onCleanup(() => editor?.dispose());

  // Reactivity effects
  createEffect(() => {
    editor?.setModel(props.model);
  });

  createEffect(() => {
    mEditor.setTheme(props.isDark ? 'vs-dark' : 'vs-light');
  });

  createEffect(() => {
    editor?.updateOptions({
      readOnly: !!props.disabled,
      fontSize: 14,
    });
  });

  createEffect(() => {
    languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: !props.displayErrors,
      noSyntaxValidation: !props.displayErrors,
    });
  });

  createEffect(() => {
    if (!editor) return;
    if (props.displayErrors) {
      runLinter(editor.getValue());
    } else {
      mEditor.setModelMarkers(props.model, 'eslint', []);
    }
  });

  return <div class="h-jsonViewerHeight no-scrollbar overflow-y-auto" ref={parent} />;
};

export default Editor;
