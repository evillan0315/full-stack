import { createSignal, onMount } from 'solid-js';
import Editor from '../components/common/Editor';
import Header from '../components/Header';
import FileManager from '../components/FileManager';
import api from '../services/api';
import { Icon } from '@iconify-icon/solid';

export default function CodeEditor() {
  const [dividerX, setDividerX] = createSignal(0);
  const [filePath, setFilePath] = createSignal('./README.md');
  const [fileContent, setFileContent] = createSignal<string>('');

  onMount(async () => {
    setDividerX(window.innerWidth / 4.4);
    await loadFile(filePath());
  });

  const loadFile = async (path: string) => {
    try {
      const formData = new FormData();
      formData.append('filePath', path);
      const response = await api.post('/file/read', formData);
      if (!response.data) throw new Error('Failed to load file');

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
      <div class="flex flex-1 overflow-hidden relative pb-8">
        <div
          class="h-full overflow-y-auto border-r dark:border-neutral-700 px-2 pt-10 pb-4 shadow-sm"
          style={{ width: `${dividerX()}px`, minWidth: '180px' }}
        >
          <div class="absolute top-0 left-0 right-0 z-10 w-full dark:bg-neutral-800 border-b dark:border-neutral-700">
            <button class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 leading-0 text-sm uppercase tracking-widest">
              <Icon icon="mdi:edit" width="22" height="22" />
            </button>
          </div>
          <FileManager onFileSelect={loadFile} />
        </div>
        <div class="flex-1 h-full overflow-hidden">
          <Editor theme="dark" filePath={filePath()} content={fileContent()} language="typescript" />
        </div>
        
      </div>
      <div class="fixed h-8 dark:bg-neutral-900 w-screen bottom-0 z-10 border-t dark:border-neutral-700 shadow-md">

        <div class="flex justify-between align-center">
		<div class="">
			<button
  onClick={() => (window.location.href = '/terminal')}
  class="flex cursor-alias items-center gap-2 px-2 py-1 text-left text-neutral-800 dark:text-neutral-100 dark:hover:text-yellow-500"
  aria-label="Open Terminal"
>
  <Icon icon="mdi:terminal" width="22" height="22" />
</button>
		</div>
	</div>
      </div>
    </div>
  );
}
