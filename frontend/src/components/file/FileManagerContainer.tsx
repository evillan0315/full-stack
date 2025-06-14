// src/components/FileManagerContainer.tsx

import { createSignal, onMount } from 'solid-js';
import type { Accessor } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import FileManager from './FileManager';

interface FileManagerContainerProps {
  left?: Accessor<string | number> | string | number;
  loadFile?: (filePath: string) => void;
}

const FileManagerContainer = (props: FileManagerContainerProps) => {
  const [refreshFileList, setRefreshFileList] = createSignal<((directory?: string) => Promise<void>) | null>(null);
  const [isOpen, setIsOpen] = createSignal(true);
  let contentRef: HTMLDivElement | undefined;

  const togglePanel = () => {
    if (!contentRef) return;

    const expanded = isOpen();
    setIsOpen(!expanded);

    if (expanded) {
      contentRef.style.maxHeight = `${contentRef.scrollHeight}px`;
      requestAnimationFrame(() => {
        contentRef!.style.maxHeight = '0px';
        contentRef!.style.overflow = 'hidden';
      });
    } else {
      contentRef.style.maxHeight = '0px';
      contentRef.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        contentRef!.style.maxHeight = `${contentRef!.scrollHeight}px`;
        setTimeout(() => {
          if (contentRef) {
            contentRef.style.maxHeight = 'none';
            contentRef.style.overflow = 'visible';
          }
        }, 300);
      });
    }
  };

  onMount(() => {
    if (isOpen() && contentRef) {
      contentRef.style.maxHeight = 'none';
      contentRef.style.overflow = 'visible';
    }
  });

  const flexValue = typeof props.left === 'function' ? props.left() : (props.left ?? 1);

  return (
    <div class="flex min-h-0 min-w-0 flex-col overflow-hidden relative" style={{ flex: flexValue }}>
      <div class="sticky top-0 z-20 border-b border-gray-500/30 bg-gray-500/10">
        <div class="flex items-center justify-between p-2">
          <button
            class="flex items-center gap-2 px-2 py-1 text-sm uppercase tracking-widest dark:hover:text-yellow-500"
            onClick={togglePanel}
          >
            <Icon icon="mdi:file" width="22" height="22" /> File Explorer
          </button>
          <div class="flex items-center gap-2">
            <button
              class="flex items-center gap-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => refreshFileList()?.()}
              title="Refresh files"
            >
              <Icon icon="mdi:refresh" width="18" height="18" />
            </button>
            <Icon
              icon={isOpen() ? 'mdi:chevron-down' : 'mdi:chevron-right'}
              width="18"
              height="18"
              class="cursor-pointer transition-transform duration-200"
              onClick={togglePanel}
            />
          </div>
        </div>
      </div>

      <div
        ref={contentRef}
        class="transition-[max-height] duration-300 ease-in-out overflow-auto"
        style={{
          'max-height': isOpen() ? 'none' : '0px',
          'overflow': isOpen() ? 'visible' : 'hidden',
        }}
      >
        <div class="pb-4 pt-2 h-[86vh] overflow-auto">
          <FileManager
            onFileSelect={(path) => {
              props.loadFile?.(path); // Ensure this calls Editor.tsx loadFile
            }}
            refreshList={(fn) => setRefreshFileList(() => fn)}
          />
        </div>
      </div>
    </div>
  );
};

export default FileManagerContainer;
