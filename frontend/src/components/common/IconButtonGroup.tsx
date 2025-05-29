import { createSignal, For } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

export interface IconButton {
  icon: string; // Iconify icon name like "mdi:edit", "mdi:delete", etc.
  iconSize?: number;
  label: string;
  onClick: () => void;
}

export interface IconButtonGroupProps {
  buttons: IconButton[];
  activeIndex?: number;
  vertical?: boolean;
}

export default function IconButtonGroup(props: IconButtonGroupProps) {
  const [active, setActive] = createSignal<number | null>(props.activeIndex ?? null);

  return (
    <div class={`flex ${props.vertical ? 'flex-col' : 'flex-row'} gap-1 p-1`}>
      <For each={props.buttons}>
        {(btn, index) => (
          <div class="group relative">
            <button
              class={`flex h-8 w-8 items-center justify-center rounded-md transition-colors bg-neutral-200 text-neutral-800 hover:bg-blue-100 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600`}
              aria-label={btn.label}
              onClick={() => {
                setActive(index());
                btn.onClick();
              }}
            >
              <Icon icon={btn.icon} width={btn.iconSize ?? 20} height={btn.iconSize ?? 20} />
            </button>
            {/* Tooltip */}
            <div
              class="pointer-events-none absolute left-1/2 z-10 mt-2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={
                {
                  //top: props.vertical ? '50%' : 'auto',
                  //bottom: props.vertical ? 'auto' : 'calc(100% + 0.5rem)',
                  //left: props.vertical ? 'calc(100% + 0.5rem)' : '50%',
                  //transform: props.vertical ? 'translateY(-50%)' : 'translateX(-50%)',
                }
              }
            >
              {btn.label}
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
