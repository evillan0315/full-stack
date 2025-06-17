import { Show, createSignal } from 'solid-js';
import { useStore } from '@nanostores/solid';
import CodeMirrorEditor from './CodeMirrorEditor';
import { EditorTopRightHeader } from './EditorTopRightHeader';
import { useGeminiTerminal } from '../../hooks/useGeminiTerminal';
import { useTerminal } from '../../hooks/useTerminal'; // Assuming you have this hook
import FileTabs from '../file/FileTabs';
import TerminalShellAi from '../TerminalShellAi';
import TerminalShell from '../TerminalShell'; // Assuming this is your local terminal component
import { useEditorFile } from '../../hooks/useEditorFile';
import { editorUnsaved } from '../../stores/editorContent'; // Only import what's used

// Define an enum or union type for terminal modes for better type safety and readability
type TerminalMode = 'none' | 'ai' | 'local';

interface EditorContainerProps {
  show?: boolean;
}

export default function EditorContainer({ show = true }: EditorContainerProps) {
  // Use a signal to control which terminal is open
  const [activeTerminal, setActiveTerminal] = createSignal<TerminalMode>('none');

  // Destructure functions from useGeminiTerminal.
  // We no longer expect terminalOpen, setTerminalOpen, toggleTerminal from useGeminiTerminal itself
  // as the global activeTerminal signal now controls visibility.
  const { /* isProcessingCommand, etc. */ } = useGeminiTerminal({ prompt: "🤖 AI > " });

  // Assuming you have a similar hook for your local terminal
  const { /* properties from useLocalTerminal if needed */ } = useTerminal({ prompt: "$ " });

  const $unsaved = useStore(editorUnsaved);
  const { saveFile } = useEditorFile();

  const handleSave = async () => {
    await saveFile();
  };

  // Function to toggle between terminals
  const toggleTerminal = (mode: TerminalMode) => {
    if (activeTerminal() === mode) {
      // If the clicked mode is already active, close it
      setActiveTerminal('none');
    } else {
      // Otherwise, set the new active mode
      setActiveTerminal(mode);
    }
  };

  // Function to close any active terminal
  const handleCloseTerminal = () => {
    setActiveTerminal('none');
  };

  return (
    <>
      <div class="editor-top-header flex items-center justify-between gap-1 h-8 px-3 py-0 border-b">
        <FileTabs />
        {/* Pass the updated toggleTerminal and activeTerminal */}
        <EditorTopRightHeader
          toggleTerminal={toggleTerminal}
          activeTerminal={activeTerminal} // Pass the Accessor directly
          viewMarkdown={undefined} // Keep as is if not used
        />
      </div>

      <CodeMirrorEditor onSave={handleSave} />

      {/* Conditionally render TerminalShellAi */}
      <Show when={activeTerminal() === 'ai'}>
        <TerminalShellAi onClose={handleCloseTerminal} />
      </Show>

      {/* Conditionally render TerminalShell (local) */}
      <Show when={activeTerminal() === 'local'}>
        <TerminalShell onClose={handleCloseTerminal} />
      </Show>
    </>
  );
}
