import { For, onMount, onCleanup } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorFilePath, editorOpenTabs, editorUnsaved } from '../../stores/editorContent';
import FileTabItem from './FileTabItem';

export default function FileTabs() {
  let scrollContainer: HTMLDivElement | undefined;

  const $openTabs = useStore(editorOpenTabs);
  const $filePath = useStore(editorFilePath);
  const $unsaved = useStore(editorUnsaved);

  const scrollBy = (amount: number) => {
    scrollContainer?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTabClick = (path: string) => {
    editorFilePath.set(path);
    document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
  };

  const handleTabClose = (closedPath: string) => {
    if ($unsaved()[closedPath]) {
      const confirmClose = confirm(`You have unsaved changes in "${closedPath}". Close anyway?`);
      if (!confirmClose) return;
    }

    const tabs = Array.isArray($openTabs()) ? $openTabs() : [];
    const remaining = tabs.filter((t) => t !== closedPath);
    editorOpenTabs.set(remaining);

    if ($filePath() === closedPath) {
      const r = remaining.length ? remaining[remaining.length - 1] : '';
      console.log(r, 'tab close');
      if (r.trim() === '') {
        alert('Empty');
      }
      editorFilePath.set(remaining.length ? remaining[remaining.length - 1] : '');
    }

    const updatedUnsaved = { ...$unsaved() };
    delete updatedUnsaved[closedPath];
    editorUnsaved.set(updatedUnsaved);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const tabs = Array.isArray($openTabs()) ? $openTabs() : [];
    const index = tabs.indexOf($filePath());

    if (e.key === 'ArrowRight' && index >= 0) {
      e.preventDefault();
      editorFilePath.set(tabs[(index + 1) % tabs.length]);
    } else if (e.key === 'ArrowLeft' && index >= 0) {
      e.preventDefault();
      editorFilePath.set(tabs[(index - 1 + tabs.length) % tabs.length]);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      if ($filePath()) handleTabClose($filePath());
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="flex items-center border-b border-gray-500/30">
      <button
        class="px-2 hover:bg-gray-700 disabled:opacity-50"
        onClick={() => scrollBy(-150)}
        aria-label="Scroll Left"
      >
        <Icon icon="mdi:chevron-left" class="text-xl" />
      </button>

      <div
        ref={(el) => (scrollContainer = el)}
        class="flex overflow-x-auto scrollbar-hide flex-1"
        style={{ 'scroll-behavior': 'smooth' }}
      >
        <For
          each={Array.isArray($openTabs()) ? $openTabs().filter((tab) => typeof tab === 'string' && tab.trim()) : []}
        >
          {(tabPath) => (
            <FileTabItem
              path={tabPath}
              active={$filePath() === tabPath}
              unsaved={!!$unsaved()[tabPath]}
              onClick={() => handleTabClick(tabPath)}
              onClose={() => handleTabClose(tabPath)}
            />
          )}
        </For>
      </div>

      <button
        class="px-2 hover:bg-gray-700 disabled:opacity-50"
        onClick={() => scrollBy(150)}
        aria-label="Scroll Right"
      >
        <Icon icon="mdi:chevron-right" class="text-xl" />
      </button>
    </div>
  );
}
