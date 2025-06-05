import { For, createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

interface FileTabsProps {
  openTabs: string[];
  activeTab: string;
  onTabClick: (path: string) => void;
  onTabClose: (path: string) => void;
}

export default function FileTabs(props: FileTabsProps) {
  let scrollContainer: HTMLDivElement | undefined;

  const scrollBy = (amount: number) => {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div class="flex items-center border-b border-gray-900/50">
      {/* Left Scroll Button */}
      <button
        class="px-2 hover:bg-gray-700 disabled:opacity-50"
        onClick={() => scrollBy(-150)}
        aria-label="Scroll Left"
      >
        <Icon icon="mdi:chevron-left" class="text-xl" />
      </button>

      {/* Scrollable Tabs */}
      <div
        ref={scrollContainer}
        class="flex overflow-x-auto scrollbar-hide flex-1"
        style={{ 'scroll-behavior': 'smooth' }}
      >
        <For each={props.openTabs}>
          {(tabPath) => (
            <div
              class={`px-4 py-1 cursor-pointer flex items-center gap-2 border-r border-gray-900/50 whitespace-nowrap ${
                tabPath === props.activeTab
                  ? 'text-gray-200 bg-gray-800/50 font-semibold'
                  : 'text-gray-200  bg-gray-900/50 hover:bg-gray-700'
              }`}
              onClick={() => props.onTabClick(tabPath)}
            >
              <span class="truncate max-w-[150px]">{tabPath.split('/').pop()}</span>
              <Icon
                icon="mdi:close"
                class="text-sm hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onTabClose(tabPath);
                }}
              />
            </div>
          )}
        </For>
      </div>

      {/* Right Scroll Button */}
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
