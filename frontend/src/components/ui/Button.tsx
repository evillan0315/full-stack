import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['class', 'disabled', 'children', 'variant']);

  const resolveButtonClasses = (variant?: string): string => {
    switch (variant) {
      case 'primary':
        return 'bg-sky-500 text-gray-950 outline-sky-300 outline outline-offset-1 hover:outline-2';
      case 'secondary':
        return 'bg-sky-100 text-slate-950 outline-slate-300 outline outline-offset-1 hover:outline-2';
      case 'outline':
        return 'bg-gray-950/10 border-gray-500/30 outline outline-gray-500/30 outline-offset-1 hover:outline-2';
      default:
        return '';
    }
  };

  return (
    <button
      class={`${resolveButtonClasses(local.variant)} cursor-pointer inline-flex items-center justify-center rounded-md px-4 shadow-sm border transition font-medium ${local.class || ''}`}
      disabled={local.disabled}
      {...others}
    >
      {local.children}
    </button>
  );
}
