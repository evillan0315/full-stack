import { createSignal, createEffect, For, Show } from 'solid-js';
import { io } from 'socket.io-client';

export default function LoggerPanel() {
  const [logs, setLogs] = createSignal<any[]>([]);
  const [geminiData, setGeminiData] = createSignal<any[]>([]);
  const [filter, setFilter] = createSignal<string>('');

  createEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(`${import.meta.env.BASE_URL_API}/logs`, {
      auth: { token: `Bearer ${token}` },
    });
    const geminiSocket = io(`${import.meta.env.BASE_URL_API}/gemini`, {
      auth: { token: `Bearer ${token}` },
    });

    socket.on('recentLogs', (initialLogs) => {
      setLogs(initialLogs.reverse());
    });

    socket.on('log', (log) => {
      setLogs(prev => [log, ...prev].slice(0, 100));
    });

    geminiSocket.on('gemini', (data) => {
      setGeminiData(prev => [data, ...prev].slice(0, 100));
    });

    return () => {
      socket.disconnect();
      geminiSocket.disconnect();
    };
  });

  const filteredLogs = () =>
    logs().filter((log) =>
      !filter() ||
      log.type?.toLowerCase().includes(filter().toLowerCase()) ||
      log.level?.toLowerCase().includes(filter().toLowerCase()) ||
      (log.tags || []).some((tag: string) =>
        tag.toLowerCase().includes(filter().toLowerCase())
      )
    );

  const filteredGemini = () =>
    geminiData().filter((entry) =>
      !filter() ||
      entry.prompt?.toLowerCase().includes(filter().toLowerCase()) ||
      entry.responseText?.toLowerCase().includes(filter().toLowerCase())
    );

  return (
    <div class="p-2 max-h-96 overflow-y-auto bg-black text-white font-mono text-xs">
      <input
        class="mb-2 w-full p-1 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-sky-500"
        placeholder="Filter logs or Gemini events..."
        value={filter()}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />

      <Show when={filteredLogs().length > 0}>
        <div class="mb-2 font-bold text-sky-400">Logs</div>
        <For each={filteredLogs()}>
          {(log) => (
            <div class="border-b border-gray-700 py-1">
              <div class="flex justify-between">
                <span class="font-bold text-sky-400">{log.type}</span>
                <span class="text-gray-500">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div class="text-gray-300">
                {log.level} -{' '}
                <pre class="whitespace-pre-wrap break-all">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              </div>
              <div class="text-gray-500 text-xs">
                Tags: {log.tags?.join(', ') || 'none'}
              </div>
            </div>
          )}
        </For>
      </Show>

      <Show when={filteredGemini().length > 0}>
        <div class="mt-4 mb-2 font-bold text-purple-400">Gemini Events</div>
        <For each={filteredGemini()}>
          {(entry) => (
            <div class="border-b border-gray-700 py-1">
              <div class="flex justify-between">
                <span class="text-purple-400">{entry.modelUsed || 'Gemini'}</span>
                <span class="text-gray-500">
                  {new Date(entry.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div class="text-gray-300">
                <div class="mb-1">
                  <span class="text-gray-500">Prompt:</span>{' '}
                  <pre class="whitespace-pre-wrap break-all">
                    {entry.prompt}
                  </pre>
                </div>
                <div>
                  <span class="text-gray-500">Response:</span>{' '}
                  <pre class="whitespace-pre-wrap break-all">
                    {entry.responseText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </For>
      </Show>

      <Show when={filteredLogs().length === 0 && filteredGemini().length === 0}>
        <div class="text-center text-gray-600 mt-4">No logs or Gemini events to display</div>
      </Show>
    </div>
  );
}

