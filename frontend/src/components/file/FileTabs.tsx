import { For, onMount, onCleanup, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorFilePath, editorOpenTabs, editorUnsaved, editorContent } from '../../stores/editorContent';
import FileTabItem from './FileTabItem';

import { Button } from '../ui/Button';
import { confirm } from '../../services/modalService';
import { confirmDiscardIfUnsaved } from '../../utils/editorUnsaved';

export default function FileTabs(): JSX.Element {
  let scrollContainer: HTMLDivElement | undefined;

  const $openTabs = useStore(editorOpenTabs);
  const $filePath = useStore(editorFilePath);
  const $content = useStore(editorContent);
  const $unsaved = useStore(editorUnsaved);

  const scrollBy = (amount: number) => {
    scrollContainer?.scrollBy({ left: amount, behavior: 'smooth' });
  };



  const handleTabClick = async (path: string) => {
  if ($filePath() === path) return;

  const ok = await confirmDiscardIfUnsaved($filePath());
  if (!ok) return;

  editorFilePath.set(path);
  document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { path } }));
};

const handleTabClose = async (closedPath: string) => {
  const ok = await confirmDiscardIfUnsaved(closedPath);
  if (!ok) return;

  // Proceed with closing
  const tabs = Array.isArray($openTabs()) ? $openTabs() : [];
  const remaining = tabs.filter((t) => t !== closedPath);
  editorOpenTabs.set(remaining);

  if ($filePath() === closedPath) {
    const r = remaining.length ? remaining[remaining.length - 1] : '';
    if (r.trim() === '') editorContent.set('');
    editorFilePath.set(r);
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
    <>
      <div id="tabsContainer" class="flex px-0 overflow-auto items-center justify-center px-2">
        {Array.isArray($openTabs()) && $openTabs().length > 1 ? (
          <>
            <Button icon="mdi:chevron-left" variant="outline" size="sm" class="mx-1" onClick={() => scrollBy(-150)} />
          </>
        ) : (
          ''
        )}

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

        {Array.isArray($openTabs()) && $openTabs().length > 1 ? (
          <>
            <Button
              variant="outline"
              icon="mdi:chevron-right"
              size="sm"
              class="mx-1"
              //disabled={`${Array.isArray($openTabs()) && $openTabs().length > 1 ? false : true }`}
              onClick={() => scrollBy(150)}
            />
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
