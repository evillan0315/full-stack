import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import Editor from "../components/common/Editor";
import Header from "../components/Header";
import FileManager from "../components/FileManager";
import api from "../services/api";
import { Icon } from "@iconify-icon/solid";

export default function CodeEditor() {
  const [dividerX, setDividerX] = createSignal(window.innerWidth / 2);
  const [dragging, setDragging] = createSignal(false);
  const [filePath, setFilePath] = createSignal("./README.md");
  const [fileContent, setFileContent] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal(true);
  const [renderedHtml, setRenderedHtml] = createSignal<string>("");

  const startDragging = (e: MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragging()) return;
    setDividerX(e.clientX);
  };

  const stopDragging = () => {
    setDragging(false);
  };

  onMount(() => {
    loadFile(filePath());
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDragging);
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDragging);
  });

  const loadFile = async (path: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("filePath", path);
      const response = await api.post("/file/read", formData);
      if (!response.data) throw new Error("Failed to load file");

      const content = response.data.data;
      setFilePath(path);
      setFileContent(content);

      // Convert markdown if applicable
      if (path.endsWith(".md")) {
  try {
    const htmlResponse = await fetch("http://localhost:5000/api/utils/to-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: content }),
    });

    const contentType = htmlResponse.headers.get("content-type") || "";
    if (!htmlResponse.ok) throw new Error(`Markdown API error: ${htmlResponse.status}`);

    const result = contentType.includes("application/json")
      ? await htmlResponse.json()
      : { html: await htmlResponse.text() };

    setRenderedHtml(result.html || "<p>Invalid Markdown preview</p>");
  } catch (err) {
    console.error("Error rendering markdown:", err);
    setRenderedHtml("<p>Error rendering markdown</p>");
  }
} else {
  setRenderedHtml("<p>No preview available</p>");
}
    } catch (err) {
      console.error(`Error loading file "${path}":`, err);
      setRenderedHtml("<p>Error loading file</p>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />

      <div class="flex flex-1 overflow-hidden relative pb-8">
        {/* File Manager */}
        <div
          class="h-full overflow-y-auto border-r dark:border-neutral-700 px-2 pt-10 pb-4 shadow-sm"
          style={{ width: "220px", minWidth: "180px" }}
        >
          <div class="absolute top-0 left-0 right-0 z-10 w-full dark:bg-neutral-800 border-b dark:border-neutral-700">
            <div class="flex justify-between align-center">
              <div>
                <button class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 text-sm uppercase tracking-widest">
                  <Icon icon="mdi:file" width="22" height="22" /> File Explorer
                </button>
              </div>
            </div>
          </div>
          <FileManager onFileSelect={loadFile} />
        </div>

        {/* Code Editor */}
        <div
          class="h-full overflow-hidden"
          style={{ width: `${dividerX()}px` }}
        >
          {!isLoading() && (
            <Editor
              theme="dark"
              filePath={filePath()}
              content={fileContent()}
              language="typescript"
            />
          )}
        </div>

        {/* Resizable Divider */}
        <div
          class="w-1 bg-neutral-300 dark:bg-neutral-700 cursor-col-resize hover:bg-yellow-500 transition-colors"
          onMouseDown={startDragging}
        ></div>

        {/* Preview Panel */}
        <div class="flex-1 h-full overflow-auto bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-200">
          <iframe
            srcDoc={renderedHtml()}
            sandbox="allow-scripts"
            class="w-full h-full border-0 rounded text-neutral-200"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <div class="fixed h-8 dark:bg-neutral-900 w-screen bottom-0 z-10 border-t dark:border-neutral-700 shadow-md">
        <div class="flex justify-between align-center">
          <div>
            <button class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-100 dark:hover:text-yellow-500">
              <Icon icon="mdi:warning-circle" width="18" height="18" />
            </button>
          </div>
          <div class="flex justify-center align-center">
            <button
              onClick={() => (window.location.href = "/terminal")}
              class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-100 dark:hover:text-yellow-500"
              aria-label="Open Terminal"
            >
              <Icon icon="mdi:terminal" width="18" height="18" />
            </button>
            <button
              onClick={() => (window.location.href = "/terminal")}
              class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-100 dark:hover:text-yellow-500"
              aria-label="Open Terminal"
            >
              <Icon icon="mdi:warning-circle" width="18" height="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

