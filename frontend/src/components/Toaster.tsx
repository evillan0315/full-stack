import { For } from 'solid-js';
import { toasts } from '../stores/toast';

/**
 *  Toaster Component.
 *
 *  A component responsible for displaying toast notifications in a fixed position
 *  on the screen.  It renders a list of toasts retrieved from the `toasts` store,
 *  applying different background colors based on the toast type (success, error, info).
 *
 *  @returns {JSX.Element} A JSX element representing the Toaster component.
 */
export default function Toaster() {
  return (
    <div class="fixed top-10 right-10 space-y-2 z-100">
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`max-w-xl px-2 py-2 rounded shadow text-white animate-fade-in-out
              ${toast.type === 'success' ? 'bg-green-600' : ''}
              ${toast.type === 'error' ? 'bg-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-600' : ''}`}
            innerHTML={toast.message}
          />
        )}
      </For>
    </div>
  );
}
