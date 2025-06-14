import { Icon } from '@iconify-icon/solid';

type FileTabItemProps = {
  path: string;
  active: boolean;
  unsaved: boolean;
  onClick: () => void;
  onClose: () => void;
};

/**
 * TabItem displays a single file tab with optional unsaved indicator.
 */
export default function FileTabItem(props: FileTabItemProps) {
  const fileName = props.path.split('/').pop() || 'Untitled';

  return (
    <div
      class={`px-4 py-1 cursor-pointer flex items-center gap-2 border-r border-gray-500/30 whitespace-nowrap ${
        props.active ? 'bg-gray-800/10 font-semibold' : 'bg-gray-700/10 hover:bg-gray-900/30'
      }`}
      onClick={props.onClick}
    >
      <span class="truncate max-w-[150px] flex items-center gap-1">
        {fileName}
        {props.unsaved && <Icon icon="mdi:asterisk" class="text-red-500" width="0.7em" height="0.7em" />}
      </span>
      <Icon
        icon="mdi:close"
        class="text-sm hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
      />
    </div>
  );
}
