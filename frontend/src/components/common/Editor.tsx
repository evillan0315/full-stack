import { createSignal, onMount } from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { detectLanguage } from "../../utils/editorLanguage";
import { getThemeExtension, getTheme } from "../../utils/editorTheme";
import api from "../../services/api";

interface CodeEditorWithAPIProps {
  filePath: string;
  theme?: "light" | "dark";
}

export default function Editor(props: CodeEditorWithAPIProps) {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView;

  const [content, setContent] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const customTheme = EditorView.theme({
    "&": {
      backgroundColor: "#171717", // Tailwind bg-neutral-900
      color: "#f4f4f5", // Optional: text-neutral-100
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#f4f4f5",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#f4f4f5",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#3f3f46", // bg-neutral-800
    },
  }, { dark: true });
  const fetchFile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("filePath", props.filePath);
      const response = await api.post("/file/read", formData);
      if (!response.data) throw new Error("Failed to load file");

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
    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        detectLanguage(props.filePath),
         //...getThemeExtension(),
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

    const response = await api.post("/file/write", formData); // Matches this controller

    if (!response.data.success) throw new Error("Failed to save file");
    alert("File saved successfully.");
  } catch (err) {
    alert("Error saving file: " + (err as Error).message);
  } finally {
    setSaving(false);
  }
};

  onMount(() => {
    fetchFile();
  });

  return (
    <div class="flex-1 overflow-auto">
    <button
        onClick={saveFile}
        disabled={saving()}
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        {saving() ? "Saving..." : "Save File"}
      </button>
      {loading() && <p>Loading file...</p>}
      {error() && <p class="text-red-600">{error()}</p>}
      <div
        ref={editorContainer}
        class="dark:bg-neutral-900 bg-neutral-100 h-screen w-screen"
      />
      
    </div>
  );
}

