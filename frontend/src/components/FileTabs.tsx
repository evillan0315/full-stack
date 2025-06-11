import { For, createSignal, onMount } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

/**
 * Defines the properties for the `FileTabs` component.
 */
interface FileTabsProps {
  /**
   * An array of strings representing the paths of the open tabs.
   */
  openTabs: string[];
  /**
   * A string representing the path of the currently active tab.
   */
  activeTab: string;
  /**
   * A callback function that is called when a tab is clicked.  It receives the path of the clicked tab as an argument.
   * @param path The path of the tab that was clicked.
   */
  onTabClick: (path: string) => void;
  /**
   * A callback function that is called when a tab's close button is clicked. It receives the path of the tab to close as an argument.
   * @param path The path of the tab to close.
   */
  onTabClose: (path: string) => void;
}

/**
 * A component that displays a horizontal row of file tabs, allowing the user to switch between open files and close them.
 * The component includes scroll buttons for navigating tabs that overflow the container.
 *
 * @param {FileTabsProps} props - The properties for the component, including the list of open tabs, the active tab, and callbacks for tab clicks and closes.
 * @returns {JSX.Element} A JSX element representing the file tabs.
 */
export default function FileTabs(props: FileTabsProps) {
  /**
   * A reference to the scrollable container element.  Used to programmatically scroll the tabs.
   */
  let scrollContainer: HTMLDivElement | undefined;

  /**
   * Scrolls the tab container horizontally by a specified amount.
   *
   * @param amount The amount to scroll, in pixels. Positive values scroll to the right, negative values scroll to the left.
   */
  const scrollBy = (amount: number) => {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div class="flex items-center border-b border-gray-500/30">
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
              class={`px-4 py-1 cursor-pointer flex items-center gap-2 border-r border-gray-500/30 whitespace-nowrap ${
                tabPath === props.activeTab ? 'bg-gray-800/10 font-semibold' : 'bg-gray-700/10 hover:bg-gray-900/30'
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
