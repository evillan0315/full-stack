import { createSignal, Show } from 'solid-js';
import TerminalShell from './TerminalShell';
import TerminalShellAi from './TerminalShellAi';
import LoggerPanel from './LoggerPanel';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';

export default function DeveloperConsole() {
  const [activeTab, setActiveTab] = createSignal<'terminal' | 'ai' | 'logs'>('terminal');

  return (
    <div class="bg-gray-950 text-gray-100 border-t border-gray-700">
      <div class="flex border-b border-gray-700">
        <Button
          variant="secondary"
          class={`btn px-4 py-2 ${activeTab() === 'terminal' ? 'bg-gray-800' : 'bg-gray-900'}`}
          onClick={() => setActiveTab('terminal')}
        >
         <Icon icon="vscode-icons:file-type-codekit" width="1.2em" height="1.2em" />  Terminal
        </Button>
        <Button
          variant="secondary"
          class={`px-4 py-2 ${activeTab() === 'ai' ? 'bg-gray-800' : 'bg-gray-900'}`}
          onClick={() => setActiveTab('ai')}
        >
          <Icon icon="vscode-icons:file-type-robots" width="1.2em" height="1.2em" /> AI Terminal
        </Button>
        <Button
          variant="secondary"
          class={`px-4 py-2 ${activeTab() === 'logs' ? 'bg-gray-800' : 'bg-gray-900'}`}
          onClick={() => setActiveTab('logs')}
        >
         <Icon icon="vscode-icons:file-type-log" width="1.2em" height="1.2em" />  Logs
        </Button>
      </div>

      <Show when={activeTab() === 'terminal'}>
        <TerminalShell />
      </Show>
      <Show when={activeTab() === 'ai'}>
        <TerminalShellAi />
      </Show>
      <Show when={activeTab() === 'logs'}>
        <LoggerPanel />
      </Show>
    </div>
  );
}

