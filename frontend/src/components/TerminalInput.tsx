import { createSignal, createEffect, onCleanup } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  osInfo: {
    user?: string;
    host?: string;
    path?: string;
    [key: string]: any;
  };
}

export default function TerminalInput(props: TerminalInputProps): JSX.Element {
  const [inputValue, setInputValue] = createSignal('');
  const [showCursor, setShowCursor] = createSignal(true);
  console.log(showCursor);
  let inputRef: HTMLInputElement | undefined;

  const truncatePath = (path?: string) => path?.split('/').slice(-2).join('/') || path;

  createEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 100);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="flex items-center overflow-hidden whitespace-nowrap text-white">
      <span class="text-green-400">{props.osInfo.user}</span>
      <span>@</span>
      <span class="text-blue-400">{props.osInfo.host}</span>
      <span class="px-1">:</span>
      <span class="max-w-[200px] truncate text-yellow-400">{truncatePath(props.osInfo.path)}</span>
      <span class="ml-1 text-green-400">$</span>
      <input
        ref={inputRef}
        class="ml-2 flex-1 bg-black py-1 font-mono text-sm text-white placeholder-gray-500 outline-none"
        type="text"
        value={inputValue()}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onSubmit(inputValue());
            setInputValue('');
          }
        }}
        placeholder=" Type your command..."
        autofocus
        spellcheck={false}
      />
    </div>
  );
}
