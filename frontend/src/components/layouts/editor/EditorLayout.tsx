import { type JSX, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { showLeftSidebar, showRightSidebar } from '../../../stores/editorLayoutStore';
import EditorLeftSidebar from './EditorLeftSidebar';
import EditorRightSidebar from './EditorRightSidebar';
import { useStore } from '@nanostores/solid';

interface EditorLayoutProps {
  content: JSX.Element;
}

export default function EditorLayout({ content }: EditorLayoutProps) {
  const [leftWidth, setLeftWidth] = createSignal(240);
  const [rightWidth, setRightWidth] = createSignal(240);
  let resizing: 'left' | 'right' | null = null;
  const $showLeftSidebar = useStore(showLeftSidebar);
  const $showRightSidebar = useStore(showRightSidebar);

  const startResize = (side: 'left' | 'right') => (e: MouseEvent) => {
    resizing = side;
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing) return;
    if (resizing === 'left') {
      const newWidth = Math.max(160, Math.min(e.clientX, 400));
      setLeftWidth(newWidth);
      localStorage.setItem('leftSidebarWidth', String(newWidth));
    } else if (resizing === 'right') {
      const newWidth = Math.max(160, Math.min(window.innerWidth - e.clientX, 500));
      setRightWidth(newWidth);
      localStorage.setItem('rightSidebarWidth', String(newWidth));
    }
  };

  const onMouseUp = () => {
    resizing = null;
  };

  onMount(() => {
    const leftSaved = localStorage.getItem('leftSidebarWidth');
    if (leftSaved) setLeftWidth(parseInt(leftSaved));
    const rightSaved = localStorage.getItem('rightSidebarWidth');
    if (rightSaved) setRightWidth(parseInt(rightSaved));

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  onCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  });

  return (
    <div class="flex flex-1 h-full overflow-hidden">
      {/* Left Sidebar */}
      <Show when={$showLeftSidebar()}>
        <div style={{ width: `${leftWidth()}px` }} class="h-full overflow-auto flex-shrink-0"> {/* Added flex-shrink-0 */}
          <EditorLeftSidebar />
        </div>
      </Show>
      {/* Left Resizer */}
      <Show when={$showLeftSidebar()}>
        <div class="w-1 cursor-col-resize resizer flex-shrink-0" onMouseDown={startResize('left')}></div> {/* Added flex-shrink-0 */}
      </Show>

      {/* Main Content Area - This is the crucial change */}
      <div class="flex flex-col flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
        {content}
      </div>

      {/* Right Resizer */}
      <Show when={$showRightSidebar()}>
        <div class="w-1 cursor-col-resize resizer flex-shrink-0" onMouseDown={startResize('right')}></div> {/* Added flex-shrink-0 */}
      </Show>
      {/* Right Sidebar */}
      <Show when={$showRightSidebar()}>
        <div style={{ width: `${rightWidth()}px` }} class="h-full overflow-auto flex-shrink-0"> {/* Added flex-shrink-0 */}
          <EditorRightSidebar />
        </div>
      </Show>
    </div>
  );
}
