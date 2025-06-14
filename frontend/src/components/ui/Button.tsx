import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  active?: boolean;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ['class', 'disabled', 'children', 'variant', 'active', 'selected', 'size']);

  const resolveButtonClasses = (variant?: string): string => {
    switch (variant) {
      case 'primary':
        return 'bg-sky-500 text-gray-950';
      case 'secondary':
        return 'bg-sky-100 text-slate-950';
      case 'outline':
        return 'bg-gray-950/10 border border-gray-500/30 outline outline-gray-500/30 outline-offset-1 hover:outline-2';
      default:
        return '';
    }
  };

  const resolveSizeClasses = (size?: string): string => {
    switch (size) {
      case 'sm':
        return 'text-sm p-1 shadow-sm rounded-sm';
      case 'md':
        return 'text-base p-2 shadow rounded-md';
      case 'lg':
        return 'text-lg p-3 shadow-md rounded-lg';
      case 'xl':
        return 'text-xl p-4 shadow-lg rounded-full';
      default:
        return 'text-sm p-1 shadow-sm rounded-sm';
    }
  };

  const stateClasses = () => {
    const classes: string[] = [];

    if (local.active) {
      classes.push('ring-2 ring-offset-2 ring-sky-400');
    }

    if (local.selected) {
      classes.push('bg-sky-600 text-white');
    }

    if (local.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    }

    return classes.join(' ');
  };

  return (
    <button
      class={`${resolveButtonClasses(local.variant)} ${resolveSizeClasses(local.size)} ${stateClasses()} cursor-pointer inline-flex items-center justify-between gap-2 transition font-medium ${local.class || ''}`}
      disabled={local.disabled}
      {...others}
    >
      {local.children}
    </button>
  );
}
