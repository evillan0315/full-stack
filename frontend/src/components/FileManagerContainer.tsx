import { createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

const FileManagerContainer = (props) => {
  const [isOpen, setIsOpen] = createSignal(true);
  let contentRef: HTMLDivElement | undefined;

  const togglePanel = () => {
    const el = contentRef;
    if (!el) return;

    if (isOpen()) {
      el.style.maxHeight = `${el.scrollHeight}px`;
      requestAnimationFrame(() => {
        el.style.maxHeight = '0px';
        el.style.overflow = 'hidden';
      });
    } else {
      el.style.maxHeight = '0px';
      el.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`;
      });
      setTimeout(() => {
        if (el) {
          el.style.maxHeight = 'none';
          el.style.overflow = 'visible';
        }
      }, 300);
    }

    setIsOpen(!isOpen());
  };

  onMount(() => {
    if (isOpen() && contentRef) {
      contentRef.style.maxHeight = 'none';
    }
  });

  return (
    <div class="flex min-h-0 min-w-0 flex-col overflow-auto relative mt-0 " style={`flex: ${props.left()}`}>
      {/* Sticky Collapsible Header */}
      <div class="sticky top-0 z-10 border-b border-gray-800/50 bg-gray-500 dark:bg-gray-900/10">
        <div class="flex justify-between items-center">
          <button
            class="flex items-center gap-2 px-2 py-1 text-sm uppercase tracking-widest text-left dark:hover:text-yellow-500"
            onClick={togglePanel}
          >
            <Icon icon="mdi:file" width="22" height="22" /> File Explorer
          </button>
          <Icon
            icon={isOpen() ? 'mdi:chevron-down' : 'mdi:chevron-right'}
            width="18"
            height="18"
            class="mr-2 transition-transform duration-200"
          />
        </div>
      </div>

      {/* Animated Collapsible Body */}
      <div ref={contentRef} class="transition-[max-height] duration-300 ease-in-out overflow-hidden mt-4">
        <div class="pb-4">
          <props.FileManager onFileSelect={props.loadFile} />
        </div>
      </div>
    </div>
  );
};

export default FileManagerContainer;
