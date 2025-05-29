import { createSignal, onMount, createEffect, For, onCleanup } from 'solid-js';
import { io, Socket } from 'socket.io-client';

interface TerminalEntry {
  type: 'message' | 'command' | 'error' | 'outputMessage';
  content: string;
}

export default function Terminal() {
  const [entries, setEntries] = createSignal<TerminalEntry[]>([]);
  const [socket, setSocket] = createSignal<Socket | null>(null);
  const [cmd, setCmd] = createSignal('');
  const [cwd, setCwd] = createSignal('/home/your-username');
  const [homeDir, setHomeDir] = createSignal('');
  const [status, setStatus] = createSignal('Disconnected');

  const [showContextMenu, setShowContextMenu] = createSignal(false);
  const [contextMenuPosition, setContextMenuPosition] = createSignal({ x: 0, y: 0 });
  const [filteredOptions, setFilteredOptions] = createSignal<string[]>([]);

  let outputRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  if (inputRef) inputRef.disabled = true;
  const availableOptions = ['Switch to AI', 'Documentation', 'Donate', 'About'];

  const updateContextMenu = (input: string) => {
    setFilteredOptions(availableOptions.filter((opt) => opt.toLowerCase().includes(input.toLowerCase().slice(1))));
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value;
    setCmd(value);

    if (value.startsWith('/')) {
      const rect = e.currentTarget.getBoundingClientRect();
      setContextMenuPosition({ x: rect.left, y: rect.bottom });
      setShowContextMenu(true);
      updateContextMenu(value);
    } else {
      setShowContextMenu(false);
    }
  };
  const scrollToBottom = () => {
    outputRef && (outputRef.scrollTop = outputRef.scrollHeight);
  };
  const addEntry = (type: TerminalEntry['type'], content: string) => {
    if (type === 'outputMessage' || (type === 'error' && content === 'Authentication required')) {
      // Update the existing div with the ID "outputMessage"
      const outputDiv = document.getElementById('outputMessage');
      if (outputDiv) {
        outputDiv.innerHTML = `<pre class="${
          type === 'error' ? 'text-red-500' : 'text-yellow-500'
        } font-light whitespace-pre-wrap">${content}</pre>`;
      }
      return; // Do not add to entries
    }

    // Check if the content is the same as the last entry to avoid duplication
    const lastEntry = entries()[entries().length - 1];
    if (lastEntry && lastEntry.content === content) {
      return; // Prevent adding duplicate content
    }

    // Update entries if it's a new entry
    setEntries((prev) => [...prev, { type, content }]);
    scrollToBottom();
  };

  const sendCommand = () => {
    if (cmd()) {
      addEntry('message', `Processing...`);
      socket()?.emit('exec', cmd());
      setCmd('');
    }
  };

  onMount(() => {
    scrollToBottom();

    const s = io(`${import.meta.env.BASE_URL}/terminal`, {
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(s);

    s.on('connect', () => {
      setStatus('Connected');
      inputRef && (inputRef.disabled = false);
    });

    s.on('connect_error', (err) => {
      console.error('Connection Error:', err.message);
      inputRef && (inputRef.disabled = true);
      setStatus('Disconnected');
    });

    s.on('osinfo', (info) => {
      setHomeDir(info.homedir);
    });
    s.on('outputMessage', (data) => {
      addEntry('outputMessage', data);
    });
    s.on('output', (data) => addEntry('message', data));
    s.on('cwdInfo', (cwd) => addEntry('message', cwd));
    s.on('error', (data) => addEntry('error', `${data}`));
    s.on('close', (msg) => addEntry('message', `\n${msg}\n`));

    s.on('prompt', ({ cwd, command }) => {
      let displayCwd = cwd;
      const home = homeDir();
      if (home && cwd.startsWith(home)) {
        displayCwd = cwd.replace(home, '~');
      } else {
        const segments = cwd.split('/');
        displayCwd = segments[segments.length - 1] || '/';
      }

      setCwd(displayCwd);
      addEntry('command', `${cwd} $ ${command}`);
    });

    onCleanup(() => s.disconnect());
  });
  const handleSelect = (selectedOption: string) => {
    setCmd('');
    setShowContextMenu(false);
    addEntry('message', `Selected: ${selectedOption}`);
  };
  createEffect(scrollToBottom);

  return (
    <div class="flex h-screen flex-col bg-black text-white">
      <div class="flex items-center justify-between border-b border-gray-900 bg-zinc-900 px-4 py-2">
        <div class={`flex gap-2 ${status() === 'Connected' ? 'text-green-400' : 'text-red-400'} items-center`}>
          {status() === 'Connected' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path
                fill="#00f02f"
                d="M21 11V9h-2V7a2.006 2.006 0 0 0-2-2h-2V3h-2v2h-2V3H9v2H7a2.006 2.006 0 0 0-2 2v2H3v2h2v2H3v2h2v2a2.006 2.006 0 0 0 2 2h2v2h2v-2h2v2h2v-2h2a2.006 2.006 0 0 0 2-2v-2h2v-2h-2v-2Zm-4 6H7V7h10Z"
              />
              <path
                fill="#00f02f"
                d="M11.361 8h-1.345l-2.01 8h1.027l.464-1.875h2.316L12.265 16h1.062Zm-1.729 5.324L10.65 8.95h.046l.983 4.374ZM14.244 8h1v8h-1z"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path
                fill="#f00"
                d="M21 11V9h-2V7a2.006 2.006 0 0 0-2-2h-2V3h-2v2h-2V3H9v2H7a2.006 2.006 0 0 0-2 2v2H3v2h2v2H3v2h2v2a2.006 2.006 0 0 0 2 2h2v2h2v-2h2v2h2v-2h2a2.006 2.006 0 0 0 2-2v-2h2v-2h-2v-2Zm-4 6H7V7h10Z"
              />
              <path
                fill="#f00"
                d="M11.361 8h-1.345l-2.01 8h1.027l.464-1.875h2.316L12.265 16h1.062Zm-1.729 5.324L10.65 8.95h.046l.983 4.374ZM14.244 8h1v8h-1z"
              />
            </svg>
          )}

          <span class={`${status() === 'Connected' ? 'text-white' : 'text-white'}`}>bashAI</span>
        </div>
        <div class="flex gap-2">
          <button onClick={() => setEntries([])} title="Clear">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="m14.03 1.889l9.657 9.657l-8.345 8.345l-.27.27H20v2H6.747l-3.666-3.666a4 4 0 0 1 0-5.657zm-8.242 11.07l-1.293 1.294a2 2 0 0 0 0 2.828l3.08 3.08h4.68l.366-.368z"
              />
            </svg>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
            <circle cx="16" cy="8" r="2" fill="#fff" />
            <circle cx="16" cy="16" r="2" fill="#fff" />
            <circle cx="16" cy="24" r="2" fill="#fff" />
          </svg>
        </div>
      </div>

      <div
        class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm"
        ref={outputRef}
        style={{ 'scroll-behavior': 'smooth' }}
      >
        <div id="outputMessage" class="my-2 px-4 py-2">
          <pre class="font-normal whitespace-pre-wrap"></pre>
        </div>
        <For each={entries()}>
          {(entry) => (
            <pre
              class={
                entry.type === 'command'
                  ? 'font-bold whitespace-pre-wrap text-yellow-400'
                  : entry.type === 'error'
                    ? 'whitespace-pre-wrap text-red-400'
                    : 'whitespace-pre-wrap'
              }
              title={entry.type === 'command' ? entry.content.split(' $ ')[0] : ''} // Set full path for commands
            >
              {entry.type === 'command' ? `${cwd()} $ ${entry.content.split(' $ ')[1]}` : entry.content}
            </pre>
          )}
        </For>
      </div>
      {/* 👇 Context Menu Dropdown */}
      {showContextMenu() && filteredOptions().length > 0 && (
        <div
          class="z-10 rounded-md border border-gray-600 bg-gray-900 text-sm text-white shadow-lg"
          style={{
            left: `${contextMenuPosition().x}px`,
            top: `${contextMenuPosition().y + 4}px`,
            width: '200px',
          }}
        >
          <div class="flex flex-col text-left">
            <For each={filteredOptions()}>
              {(option) => (
                <button
                  class="flex items-center gap-2 px-4 py-2 text-left text-gray-100 hover:bg-gray-800"
                  onClick={() => handleSelect(option)}
                >
                  {option === 'Switch to AI' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#fff"
                        d="m20.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M12 4a8 8 0 1 0 7.944 7.045l1.986-.236Q22 11.396 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2c.861 0 1.699.11 2.498.315L14 4.252A8 8 0 0 0 12 4m1 7h3l-5 7v-5H8l5-7z"
                      />
                    </svg>
                  ) : option === 'Documentation' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="#fff"
                        d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6"
                      />
                    </svg>
                  ) : option === 'About' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                      <path
                        fill="#fff"
                        fill-rule="evenodd"
                        d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"
                      />
                    </svg>
                  ) : option === 'Donate' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill="#fff"
                        d="M4 21h9.62a4 4 0 0 0 3.037-1.397l5.102-5.952a1 1 0 0 0-.442-1.6l-1.968-.656a3.04 3.04 0 0 0-2.823.503l-3.185 2.547l-.617-1.235A3.98 3.98 0 0 0 9.146 11H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2m0-8h5.146c.763 0 1.448.423 1.789 1.105l.447.895H7v2h6.014a1 1 0 0 0 .442-.11l.003-.001l.004-.002h.003l.002-.001h.004l.001-.001c.009.003.003-.001.003-.001c.01 0 .002-.001.002-.001h.001l.002-.001l.003-.001l.002-.001l.002-.001l.003-.001l.002-.001c.003 0 .001-.001.002-.001l.003-.002l.002-.001l.002-.001l.003-.001l.002-.001h.001l.002-.001h.001l.002-.001l.002-.001c.009-.001.003-.001.003-.001l.002-.001a1 1 0 0 0 .11-.078l4.146-3.317c.262-.208.623-.273.94-.167l.557.186l-4.133 4.823a2.03 2.03 0 0 1-1.52.688H4zM16 2h-.017c-.163.002-1.006.039-1.983.705c-.951-.648-1.774-.7-1.968-.704L12.002 2h-.004c-.801 0-1.555.313-2.119.878C9.313 3.445 9 4.198 9 5s.313 1.555.861 2.104l3.414 3.586a1.006 1.006 0 0 0 1.45-.001l3.396-3.568C18.688 6.555 19 5.802 19 5s-.313-1.555-.878-2.121A2.98 2.98 0 0 0 16.002 2zm1 3c0 .267-.104.518-.311.725L14 8.55l-2.707-2.843C11.104 5.518 11 5.267 11 5s.104-.518.294-.708A.98.98 0 0 1 11.979 4c.025.001.502.032 1.067.485q.121.098.247.222l.707.707l.707-.707q.126-.124.247-.222c.529-.425.976-.478 1.052-.484a1 1 0 0 1 .701.292c.189.189.293.44.293.707"
                      />
                    </svg>
                  ) : null}
                  {option}
                </button>
              )}
            </For>
          </div>
        </div>
      )}

      {/* 👇 Input Area */}
      <div class="relative flex items-center justify-between gap-2 pb-4">
        <span class={`ml-4 ${status() === 'Connected' ? 'text-green-400' : 'text-red-400'}`}>$</span>
        <input
  ref={inputRef}
  class={`flex-1 bg-black ${
    status() === 'Connected' ? 'text-green-400' : 'text-red-400'
  } rounded-md px-1 text-sm focus:outline-none focus:ring-0`}
  type="text"
  placeholder={`${status() === 'Connected' ? 'Type a command...' : status()}`}
  value={cmd()}
  autofocus
  onInput={handleInput}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      sendCommand();
      setShowContextMenu(false);
    }
  }}
/>
      </div>
    </div>
  );
}
