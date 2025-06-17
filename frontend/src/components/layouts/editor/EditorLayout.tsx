// src/components/layouts/content/ContentEditorLayout.tsx
import { type JSX, createSignal, onMount, onCleanup, Show } from 'solid-js';
import EditorLeftSidebar from './EditorLeftSidebar';
import RightSidebar from '../RightSidebar';
interface EditorLayoutProps {
  content: JSX.Element;
  rightSidebar: boolean;
  leftSidebar: boolean;
}

export default function EditorLayout({ content, rightSidebar = true, leftSidebar = true }: EditorLayoutProps) {
  const [leftWidth, setLeftWidth] = createSignal(240); // initial 240px
  const [rightWidth, setRightWidth] = createSignal(240);
  let resizing: 'left' | 'right' | null = null;

  const startResize = (side: 'left' | 'right') => (e: MouseEvent) => {
    resizing = side;
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing) return;
    if (resizing === 'left') {
      const newWidth = Math.max(120, Math.min(e.clientX, 400));
      setLeftWidth(newWidth);
      localStorage.setItem('leftSidebarWidth', String(newWidth));
    } else if (resizing === 'right') {
      const newWidth = Math.max(120, Math.min(window.innerWidth - e.clientX, 400));
      setRightWidth(newWidth);
      localStorage.setItem('rightSidebarWidth', String(newWidth));
    }
  };

  const onMouseUp = () => {
    resizing = null;
  };

  onMount(() => {
    // Load saved widths
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
    <div class="flex flex-1 overflow-hidden">
      <div class="h-full overflow-auto" style={{ width: `${leftSidebar ? leftWidth() + 'px' : '0px'}` }}>
        <Show when={leftSidebar}>
          <EditorLeftSidebar />
        </Show>
      </div>

      {leftSidebar && (
        <div id="leftResizer" class="w-1 cursor-col-resize resizer" onMouseDown={startResize('left')}></div>
      )}

      <div class="flex-1 flex flex-col overflow-hidden">{content}</div>

      {rightSidebar && (
        <>
          <div id="rightResizer" class="resizer w-1 cursor-col-resize " onMouseDown={startResize('right')}></div>
          <div class="overflow-auto" style={{ width: `${rightWidth()}px` }}>
            <Show when={rightSidebar}>
              <RightSidebar />
            </Show>
          </div>
        </>
      )}
    </div>
  );
}
