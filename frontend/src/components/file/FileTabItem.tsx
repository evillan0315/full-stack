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
  console.log(editorUnsaved.get());
  const fileName = createMemo(() => props.path.split('/').pop() || '');
  const hasUnsaved = createMemo(() => !!$unsaved()[props.path]);

  return (
    <div
      class={`cursor-pointer flex items-center gap-2 text-sm font-light ${
        props.active
          ? 'text-sky-600 hover:bg-gray-900/40 font-semibold border-b border-sky-600'
          : 'hover:bg-gray-900/80'
      }`}
    >
      <div class="px-4 py-3 flex items-center gap-2" onClick={() => props.onClick?.(props.path)}>
        <div class="truncate max-w-[100px]" title={props.path}>
          {fileName()}
          {hasUnsaved() && <span class="ml-1 text-info-600">*</span>}
        </div>
        <Icon
          title={`Close ${fileName()}`}
          icon="mdi:close"
          class="text-red-600 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            props.onClose?.(props.path);
          }}
        />
      </div>
    </div>
  );
}
