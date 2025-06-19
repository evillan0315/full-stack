import { createMemo, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorUnsaved } from '../../stores/editorContent';

interface FileTabItemProps {
  path: string;
  active?: boolean;
  onClick?: (path: string) => void;
  onClose?: (path: string) => void;
}

export default function FileTabItem(props: FileTabItemProps): JSX.Element {
  const $unsaved = useStore(editorUnsaved);
  // console.log(editorUnsaved.get()); // No need for this console.log in production code

  const fileName = createMemo(() => props.path.split('/').pop() || '');
  const hasUnsaved = createMemo(() => !!$unsaved()[props.path]);

  return (
    <div
      class={`
        cursor-pointer
        flex-shrink-0           // Important: Prevent tabs from shrinking too much initially
        flex
        items-center
        gap-2
        text-sm
        font-light
        px-0 py-0              // Remove padding from here, add to inner div
        ${
          props.active
            ? 'text-sky-600 hover:bg-gray-900/40 font-semibold border-b border-sky-600'
            : 'hover:bg-gray-900/80'
        }
      `}
    >
      <div
        class="
          px-4 py-3            // Apply padding here for clickable area
          flex
          items-center
          gap-2
          min-w-0              // Allow the div to shrink below its content's intrinsic size
          max-w-[200px]        // Add a reasonable max-width if you want to limit individual tab width, or remove for full flexibility
        "
        onClick={() => props.onClick?.(props.path)}
      >
        <span
          class="
            truncate           // Truncate text if it overflows
            overflow-hidden    // Hide overflowing content
            whitespace-nowrap  // Prevent text from wrapping
            flex-grow          // Allow the text to grow and take available space
            min-w-0            // Essential for truncate to work correctly in flex containers
          "
          title={props.path}
        >
          {fileName()}
        </span>
        {hasUnsaved() && <span class="ml-1 text-info-600 flex-shrink-0">*</span>} {/* Make sure '*' doesn't shrink */}
      </div>
      <Icon
        title={`Close ${fileName()}`}
        icon="mdi:close"
        class="text-red-600 hover:text-red-500 mr-2 flex-shrink-0" // Add margin-right and flex-shrink-0
        onClick={(e) => {
          e.stopPropagation();
          props.onClose?.(props.path);
        }}
      />
    </div>
  );
}
