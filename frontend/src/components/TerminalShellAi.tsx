import { createSignal, onCleanup, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';
import { Button } from './ui/Button'
import { useGeminiTerminal } from '../hooks/useGeminiTerminal'; // Your updated hook

interface TerminalShellProps {
  fontSize?: number;
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function TerminalShellAi(props: TerminalShellProps) {
  let terminalRef!: HTMLDivElement;
  const [height, setHeight] = createSignal(200);
  const [isResizing, setIsResizing] = createSignal(false);

  // Use the updated hook
  const { term, initialize, handleResize, dispose, isProcessingCommand } = useGeminiTerminal({
    fontSize: props.fontSize ?? 12, // Increased default font size for better readability
    prompt: '$', // This prompt is now mostly handled internally by useTerminal
  });

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.cursor = 'ns-resize';
  };

  const stopResizing = () => {
    if (isResizing()) {
      setIsResizing(false);
      document.body.style.cursor = '';
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isResizing()) {
      const rect = terminalRef.getBoundingClientRect();
      setHeight(Math.max(100, rect.bottom - e.clientY));
    }
  };

  const closeTerminal = () => props.onClose?.();

  onMount(() => {
    initialize(terminalRef); // Initialize the terminal instance

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
      dispose(); // Clean up xterm.js instance
    });
  });

  return (
    <div class="flex flex-col border-t h-auto transition-all duration-200">
    <div class="terminal-wrapper flex items-center justify-between h-8 px-3">
        <div class="flex items-center justify-start gap-2">
            <Button variant="secondary" icon="mdi:robot-happy-outline" class="p-0 text-sky-400" onClick={closeTerminal} />
            <span>AI Terminal</span>
            {isProcessingCommand() && (
                <div class="flex items-center gap-1">
                    <span class="spinner text-sky-400">
                        <svg class="animate-spin h-4 w-4 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </span>
                    <span class="text-xs text-yellow-400">(Thinking...)</span>
                </div>
            )}
        </div>
        <div class="flex items-center gap-0 text-xs">
            <Button variant="secondary" icon="mdi:close" class="p-0 text-red-500 hover:text-red-400" onClick={closeTerminal} />
        </div>
    </div>
    <div class="h-1 cursor-ns-resize bg-gray-700 hover:bg-sky-500" onMouseDown={startResizing} />
    <div
        ref={el => (terminalRef = el)}
        class="bg-black text-xs font-mono p-2"
        style={{ height: `${height()}px` }}
    />
</div>
  );
}

