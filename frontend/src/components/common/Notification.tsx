// Notification.tsx
import { createSignal, onCleanup } from 'solid-js';

const [message, setMessage] = createSignal<string | null>(null);
const [type, setType] = createSignal<'success' | 'error'>('success');

let timeoutId: ReturnType<typeof setTimeout>;

export function showNotification(msg: string, msgType: 'success' | 'error' = 'success') {
  setMessage(msg);
  setType(msgType);

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => setMessage(null), 3000);
}

export default function Notification() {
  return (
    message() && (
      <div
        class={`fixed top-4 right-4 px-4 py-2 z-50 rounded shadow-md text-white transition-opacity duration-300 ${
          type() === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        {message()}
      </div>
    )
  );
}
