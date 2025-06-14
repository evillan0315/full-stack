import { type Component, For, createSignal, Show, onCleanup, onMount } from 'solid-js';
import { type IconifyIcon, Icon } from '@iconify-icon/solid';
import { Button } from './Button';

interface DropdownItem {
  label?: string;
  icon: string | IconifyIcon;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  label?: string;
  icon: string | IconifyIcon;
  iconSize?: string | number;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const DropdownMenu: Component<DropdownMenuProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const resolveTextSizeClass = (size?: string): string => {
    switch (size) {
      case 'sm':
        return 'text-sm w-48';
      case 'md':
        return 'text-base w-58';
      case 'lg':
        return 'text-lg w-75';
      case 'xl':
        return 'text-xl w-100';
      default:
        return 'text-sm w-48';
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="relative inline-block text-left" ref={containerRef}>
      <Button variant={props.variant} size={props.size} onClick={toggleDropdown}>
        <Icon icon={props.icon} width={props.iconSize || '1.4em'} height={props.iconSize || '1.4em'} />
        {props.label}
      </Button>

      <Show when={isOpen()}>
        <div class="dropdown-menu absolute bottom-full mb-6 right-0 border shadow-md rounded z-50">
          <ul class={resolveTextSizeClass(props.size)}>
            <For each={props.items}>
              {(item) => (
                <li
                  class="flex items-center justify-start gap-2 px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  <Icon icon={item.icon} width={props.iconSize || '1.4em'} height={props.iconSize || '1.4em'} />
                  {item.label}
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
