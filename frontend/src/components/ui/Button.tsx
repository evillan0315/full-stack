import { splitProps, Show, createEffect, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'error' | 'info' | 'warning' | 'success';
  active?: boolean;
  selected?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: string | JSX.Element;
  loading?: boolean;
};

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, [
    'class',
    'disabled',
    'children',
    'variant',
    'active',
    'selected',
    'size',
    'icon',
    'loading',
    'aria-label',
  ]);

  const hasLabel = !!local.children;
  const isIconOnly = !!local.icon && !hasLabel;

  // ARIA enforcement
  createEffect(() => {
    if (isIconOnly && !local['aria-label']) {
      console.warn('Accessibility warning: Icon-only button should have an aria-label for screen readers.');
    }
  });

  const resolveButtonClasses = (): string => {
    if (isIconOnly && !local.variant) {
      return 'text-gray-700 hover:text-gray-900';
    }

    switch (local.variant) {
      case 'primary':
        return 'bg-sky-500 text-gray-950 hover:bg-sky-600';
      case 'secondary':
        return 'bg-gray-600/10 text-sky-500 hover:bg-gray-700/30';
      case 'outline':
        return 'outline outline-gray-500/30 outline-offset-1 hover:outline-2';
      case 'error':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'info':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'warning':
        return 'bg-orange-400 text-gray-900 hover:bg-orange-500';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      default:
        return isIconOnly ? 'text-sky-600 hover:text-sky-700' : 'hover:text-sky-600';
    }
  };

  const resolveSizeClasses = (): string => {
    switch (local.size) {
      case 'sm':
        return 'text-sm px-2 py-1 shadow-sm rounded-sm';
      case 'md':
        return 'text-base px-3 py-1.5 shadow rounded-md';
      case 'lg':
        return 'text-lg px-4 py-2 shadow-md rounded-lg';
      case 'xl':
        return 'text-xl px-5 py-3 shadow-lg rounded-full';
      default:
        return 'text-sm px-2 py-1 shadow-sm rounded-sm';
    }
  };

  const stateClasses = (): string => {
    const classes: string[] = [];

    if (local.active) {
      classes.push('ring-2 ring-offset-2 ring-sky-400');
    }

    if (local.selected) {
      classes.push('bg-sky-600 text-white');
    }

    if (local.disabled || local.loading) {
      classes.push('opacity-50 cursor-not-allowed');
    }

    return classes.join(' ');
  };

  return (
    <button
      class={`inline-flex items-center justify-center gap-2 cursor-pointer transition
        ${resolveButtonClasses()} ${resolveSizeClasses()} ${stateClasses()} ${local.class || ''}`}
      disabled={local.disabled || local.loading}
      aria-label={local['aria-label']}
      {...others}
    >
      <Show when={local.loading}>
        <Icon icon="svg-spinners:180-ring-with-bg" class="animate-spin h-4 w-4" />
      </Show>
      <Show when={!local.loading && local.icon}>
        {typeof local.icon === 'string' ? <Icon icon={local.icon} class="inline-block" /> : local.icon}
      </Show>
      <Show when={!local.loading}>{local.children}</Show>
    </button>
  );
}
