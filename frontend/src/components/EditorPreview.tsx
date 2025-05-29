import { createSignal, Show, onMount, Component } from 'solid-js';
import { GridResizer } from './common/GridResizer';
import MarkdownViewer from './MarkdownViewer';

interface EditorPreviewProps {
  previewContent: string;
}

const EditorPreview: Component<EditorPreviewProps> = (props) => {
  const [dividerY, setDividerY] = createSignal(0);
  const [showResizer, setShowResizer] = createSignal(false);

  onMount(() => {
    setDividerY(window.innerHeight / 2);
  });

  const handleYResize = (_x: number, y: number) => {
    setDividerY(y);
  };

  return (
    <div class="h-full">
      {/* Top (Markdown Viewer) */}
      <div
        class="p-4 overflow-auto"
        style={{ height: showResizer() ? `${dividerY()}px` : '100%' }}
      >
        <MarkdownViewer content={props.previewContent} />
      </div>

      {/* Resizer */}
      <Show when={showResizer()}>
        <GridResizer isHorizontal onResize={handleYResize} />
      </Show>

      {/* Bottom (Placeholder) */}
      <div class="flex-1 overflow-auto" />
    </div>
  );
};

export default EditorPreview;

