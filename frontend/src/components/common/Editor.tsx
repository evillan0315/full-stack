import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { detectLanguage } from "../../utils/editorLanguage";
import { getThemeExtension } from "../../utils/editorTheme";
import api from "../../services/api";

interface CodeEditorWithAPIProps {
  filePath: string;
  theme?: "light" | "dark";
  content?: string;
}

export default function Editor(props: CodeEditorWithAPIProps) {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const [content, setContent] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");

  const fetchFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("filePath", props.filePath);
      const response = await api.post("/file/read", formData);
      if (!response.data?.data) throw new Error("Failed to load file");

      const code = response.data.data;
      setContent(code);
      initEditor(code);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const initEditor = (code: string) => {
    if (editorView) {
      editorView.destroy();
      editorView = null;
    }

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        detectLanguage(props.filePath),
        getThemeExtension(props.theme || "dark"),
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

  const saveFile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("filePath", props.filePath);
      formData.append("content", content());

      const response = await api.post("/file/write", formData);
      if (!response.data.success) throw new Error("Failed to save file");

      alert("File saved successfully.");
    } catch (err) {
      alert("Error saving file: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Initial load
  onMount(fetchFile);

  // Re-fetch when filePath changes
  createEffect(() => {
    fetchFile();
  });

  // Cleanup
  onCleanup(() => {
    if (editorView) editorView.destroy();
  });

  return (
    <div class="h-full relative">
      <div class="absolute top-2 right-4 z-10">
        <button
          onClick={saveFile}
          disabled={saving()}
          class="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          {saving() ? "Saving..." : "Save File"}
        </button>
      </div>

      {loading() && <p class="p-4 text-sm text-gray-500">Loading file...</p>}
      {error() && <p class="text-red-600 p-4">{error()}</p>}

      <div
        ref={editorContainer}
        class="dark:bg-neutral-900 bg-neutral-100 h-full w-full"
      />
    </div>
  );
}

