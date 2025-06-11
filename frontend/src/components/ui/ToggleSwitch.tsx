import type { JSX } from 'solid-js';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export default function ToggleSwitch(props: ToggleSwitchProps): JSX.Element {
  return (
    <label class="flex items-center cursor-pointer gap-2">
      {props.label && <span class="text-sm">{props.label}</span>}
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only peer"
          checked={props.checked}
          onChange={(e) => props.onChange(e.currentTarget.checked)}
        />
        <div class="w-11 h-6 rounded-full border border-gray-500/30 peer-checked:bg-sky-100 transition-colors"></div>
        <div class="absolute top-0.5 left-0.5 w-5 h-5 border bg-gray-800 rounded-full transition-transform peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}
