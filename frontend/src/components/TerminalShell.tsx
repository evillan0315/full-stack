// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/TerminalShell.tsx

import { createSignal, onCleanup, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
//import 'xterm/css/xterm.css';

/**
 * Defines the properties for the TerminalShell component.
 */
interface TerminalShellProps {
  /**
   * The font size to use for the terminal.  Defaults to 12.
   */
  fontSize?: number;
  /**
   * Whether to automatically focus the terminal on mount. Defaults to `false` (handled by the `tabindex="0"` attribute on the div).
   */
  autoFocus?: boolean;
}

/**
 * A terminal component that provides a shell-like interface connected to a backend via Socket.IO.
 * It utilizes xterm.js for terminal emulation.
 *
 * @param props - The properties to configure the terminal shell.
 * @returns A SolidJS component representing the terminal shell.
 */
export default function TerminalShell(props: TerminalShellProps) {
  /**
   * A reference to the HTML div element that will host the terminal.  This is initialized in the JSX.
   */
  let terminalRef!: HTMLDivElement;
  /**
   * A signal holding the Socket.IO client instance.
   */
  const [socket, setSocket] = createSignal<Socket>();
  /**
   * A signal holding the xterm.js Terminal instance.
   */
  const [term, setTerm] = createSignal<Terminal>();
  /**
   * A signal holding the current working directory. It's updated by the backend.
   */
  const [cwd, setCwd] = createSignal<string | null>('~');

  /**
   * An array to store the command history for up/down arrow navigation.
   */
  const commandHistory: string[] = [];
  /**
   * An index to keep track of the current position in the command history.
   */
  let historyIndex = -1;
  /**
   * The current line being typed by the user.
   */
  let currentLine = '';

  /**
   * Writes the current working directory prompt to the terminal.
   */
  const prompt = () => {
    term()?.write(`\x1b[1;32m${cwd()}\x1b[0m $ `);
  };

  /**
   * Emits the given command to the backend via Socket.IO.
   * @param command - The command to execute.
   */
  const handleCommand = (command: string) => {
    socket()?.emit('exec', command);
  };

  /**
   * Handles key presses within the terminal.  This manages special keys like Enter, Backspace, and arrow keys
   * for command history navigation.
   *
   * @param key - The key that was pressed.
   */
  const handleKey = (key: string) => {
    const terminal = term();
    if (!terminal) return;

    switch (key) {
      case '\r': // Enter
        terminal.write('\r\n \n');
        handleCommand(currentLine);
        commandHistory.push(currentLine);
        historyIndex = commandHistory.length;
        currentLine = '';
        break;
      case '\u007F': // Backspace
        if (currentLine.length > 0) {
          terminal.write('\b \b');
          currentLine = currentLine.slice(0, -1);
        }
        break;
      case '\u001b[A': // Up arrow
        if (historyIndex > 0) {
          historyIndex--;
          const cmd = commandHistory[historyIndex];
          terminal.write('\x1b[2K\r'); // Clear line
          prompt();
          terminal.write(cmd);
          currentLine = cmd;
        }
        break;
      case '\u001b[B': // Down arrow
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          const cmd = commandHistory[historyIndex];
          terminal.write('\x1b[2K\r');
          prompt();
          terminal.write(cmd);
          currentLine = cmd;
        } else {
          historyIndex = commandHistory.length;
          terminal.write('\x1b[2K\r');
          prompt();
          currentLine = '';
        }
        break;
      default:
        terminal.write(key);
        currentLine += key;
    }
  };

  /**
   * Lifecycle hook that runs after the component mounts. It initializes the xterm.js terminal,
   * connects to the Socket.IO server, and sets up event listeners.
   */
  onMount(() => {
    const termInstance = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      convertEol: true,
      fontSize: props.fontSize ?? 12,
      theme: { background: '#030712' },
    });

    const fitAddon = new FitAddon();
    termInstance.loadAddon(fitAddon);
    setTerm(termInstance);

    termInstance.open(terminalRef);
    fitAddon.fit();

    window.addEventListener('resize', () => fitAddon.fit());

    termInstance.onData(handleKey);
    prompt();
    terminalRef.focus();

    terminalRef.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text');
      if (text) termInstance.write(text);
    });

    terminalRef.addEventListener('copy', (e: ClipboardEvent) => {
      const selection = termInstance.getSelection();
      if (selection) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', selection);
      }
    });

    const token = localStorage.getItem('token');

    const socketInstance = io(`${import.meta.env.BASE_URL_API}/terminal`, {
      auth: { token: `Bearer ${token}` },
      //withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('[✔] Terminal connected');
    });
    socketInstance.on('outputInfo', (msg: { cwd: string }) => {
      setCwd(msg.cwd);
      //prompt();
    });
    socketInstance.on('output', (msg: string) => {
      termInstance.writeln(msg);
      prompt();
    });

    socketInstance.on('prompt', ({ cwd: newCwd }: { cwd: string }) => {
      setCwd(newCwd);
    });

    socketInstance.on('error', (err: string) => {
      termInstance.writeln(`\x1b[1;31mError:\x1b[0m ${err}`);
      prompt();
    });

    onCleanup(() => {
      window.removeEventListener('resize', () => fitAddon.fit());
      socketInstance.disconnect();
      termInstance.dispose();
    });
  });

  return (
    <div class="p-2 h-full w-full">
      <div ref={(el) => (terminalRef = el)} class="h-full w-full focus:outline-none" tabindex="0" />
    </div>
  );
}
