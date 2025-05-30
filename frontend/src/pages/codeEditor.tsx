import { createSignal, onMount } from 'solid-js';
import Editor from '../components/common/Editor';
import Header from '../components/Header';
import FileManager from '../components/FileManager';
import api from "../services/api";
export default function CodeEditor() {
  const [dividerX, setDividerX] = createSignal(0);
  const [filePath, setFilePath] = createSignal('./README.md');
  const [fileContent, setFileContent] = createSignal<string>('');

  onMount(async () => {
    setDividerX(window.innerWidth / 4);
    await loadFile(filePath());
  });
  
  const loadFile = async (path: string) => {
    try {
      const formData = new FormData();
      formData.append("filePath", path);
      const response = await api.post("/file/read", formData);
      if (!response.data) throw new Error("Failed to load file");


      const content = response.data;
      setFilePath(path);
      setFileContent(content.data);
    } catch (err) {
      console.error(`Error loading file "${path}":`, err);
    } 

  };

  return (
    <div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />
      <div class="flex flex-1 overflow-hidden">
        <div
          class="h-full overflow-y-auto border-r border-gray-300 dark:border-neutral-700 p-2"
          style={{ width: `${dividerX()}px`, minWidth: '200px' }}
        >
          <FileManager onFileSelect={loadFile} />
        </div>
        <div class="flex-1 h-full overflow-hidden">
          <Editor theme="dark" filePath={filePath()} content={fileContent()} language="typescript" />
        </div>
      </div>
    </div>
  );
}

