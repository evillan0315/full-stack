import { JSX } from "solid-js";

export function IconButton(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { class: className, children, ...rest } = props;

  return (
    <button
      type="button"
      class={`relative inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10 ${className || ""}`}
      {...rest}
    >
      <span class="absolute top-1/2 left-1/2 size-11 -translate-1/2 pointer-fine:hidden" />
      {children}
    </button>
  );
}

