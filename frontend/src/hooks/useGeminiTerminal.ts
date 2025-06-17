// src/hooks/useTerminal.ts
import { createSignal, onCleanup, type Accessor } from 'solid-js';
import { Terminal, ITheme } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { generateGeminiText } from '../services/gemini'; // Your Gemini API service
import { useEditorFile } from './useEditorFile';
import { editorFilePath, editorOpenTabs, editorUnsaved, editorContent } from '../stores/editorContent';
// Define the theme interface for xterm.js to ensure type safety
interface XtermTheme extends ITheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

// Basic Xterm.js options
const TERMINAL_OPTIONS = {
  cursorBlink: true,
  macOptionIsMeta: true,
  altClickMovesCursor: false,
  bellStyle: 'none',
  theme: {
    background: '#000000', // Dark background for the terminal
    foreground: '#9ae6b4', // Light gray text
    cursor: '#9ae6b4',     // Green cursor
    selection: '#4a5568',  // Darker gray selection
    black: '#000000',
    red: '#e53e3e',
    green: '#48bb78',
    yellow: '#ecc94b',
    blue: '#4299e1',
    magenta: '#9f7aea',
    cyan: '#38b2ac',
    white: '#ffffff',
    brightBlack: '#2d3748',
    brightRed: '#f56565',
    brightGreen: '#68d391',
    brightYellow: '#f6e05e',
    brightBlue: '#63b3ed',
    brightMagenta: '#b794f4',
    brightCyan: '#4fd1c5',
    brightWhite: '#edf2f7'
  } as XtermTheme, // Assert the theme type
};

interface UseTerminalProps {
  fontSize?: number;
  prompt?: string;
}

interface UseTerminalReturn {
  term: Terminal | undefined;
  initialize: (terminalElement: HTMLDivElement) => void;
  handleResize: () => void;
  dispose: () => void;
  isProcessingCommand: Accessor<boolean>;
}

/**
 * Custom SolidJS hook for managing an xterm.js terminal instance,
 * now integrated with the Google Gemini AI service.
 *
 * @param {UseTerminalProps} props
 * @returns {UseTerminalReturn}
 */
export function useGeminiTerminal(props: UseTerminalProps): UseTerminalReturn {
  const [terminalOpen, setTerminalOpen] = createSignal(false);
  let term: Terminal | undefined; // xterm.js Terminal instance
  let fitAddon: FitAddon | undefined; // FitAddon instance for resizing
  let inputBuffer: string = ''; // Buffer to store user input
  let commandHistory: string[] = []; // Simple history for up/down arrows
  let historyIndex: number = -1;
  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen());
  };
  
  const [isProcessingCommand, setIsProcessingCommand] = createSignal<boolean>(false); // Reactive signal for loading state
  const GEMINI_PROMPT: string = '🤖 AI > '; // Custom prompt for Gemini interaction

  /**
   * Writes the custom Gemini prompt to the terminal.
   */
  const writePrompt = (): void => {
    if (term) {
      term.write(`\r\n${GEMINI_PROMPT}`);
    }
  };

  /**
   * Initializes the xterm.js terminal and sets up event listeners.
   * @param {HTMLDivElement} terminalElement The DOM element to attach the terminal to.
   */
  const initialize = (terminalElement: HTMLDivElement): void => {
    if (!terminalElement) {
      console.error('Terminal element not found.');
      return;
    }
    console.log(editorFilePath.get(), 'useGeminiTerminal editor content');
    term = new Terminal({
      fontSize: props.fontSize ?? 12, // Provide a default if undefined
      ...TERMINAL_OPTIONS,
    });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalElement);
    fitAddon.fit(); // Initial fit

    term.write('Welcome to the AI-powered terminal!\r\n');
    term.write('Type your questions or commands below.\r\n');
    writePrompt();

    // Event listener for user input
    term.onData((data: string) => {
      if (isProcessingCommand()) { // Block input if a command is already being processed
        return;
      }
      const charCode: number = data.charCodeAt(0);

      // Handle special keys
      if (charCode === 13) { // Enter key
        term?.write('\r\n'); // Move to a new line
        processCommand(inputBuffer.trim()); // Process the command
        inputBuffer = ''; // Clear the buffer
      } else if (charCode === 127) { // Backspace
        if (inputBuffer.length > 0) {
          term?.write('\b \b'); // Erase character from terminal
          inputBuffer = inputBuffer.slice(0, -1); // Remove from buffer
        }
      } else if (charCode === 27) { // Escape sequences (e.g., arrow keys)
        // Basic arrow key support for history (up/down)
        if (data === '\x1b[A') { // Up arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputBuffer = commandHistory[historyIndex];
            term?.write('\x1b[2K\r'); // Clear current line
            term?.write(GEMINI_PROMPT + inputBuffer); // Write prompt and historical command
          }
        } else if (data === '\x1b[B') { // Down arrow
          if (historyIndex > 0) {
            historyIndex--;
            inputBuffer = commandHistory[historyIndex];
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT + inputBuffer);
          } else if (historyIndex === 0) {
            historyIndex = -1; // Reset to no history
            inputBuffer = '';
            term?.write('\x1b[2K\r');
            term?.write(GEMINI_PROMPT);
          }
        }
      } else if (charCode >= 32 && charCode <= 126) { // Printable characters
        term?.write(data);
        inputBuffer += data;
        historyIndex = -1; // Reset history index on new input
      }
    });
  };

  /**
   * Processes the user's command by sending it to Gemini and displaying the response.
   * @param {string} command The command/prompt entered by the user.
   */
  const processCommand = async (command: string): Promise<void> => {
    if (!command) {
      writePrompt(); // Just show a new prompt if command is empty
      return;
    }

    setIsProcessingCommand(true); // Set loading state
    term?.write('\x1b[33mProcessing with Gemini...\x1b[0m\r\n'); // Yellow text for processing

    // Add command to history (if not empty)
    if (command && commandHistory[0] !== command) { // Avoid duplicates if last command was same
      commandHistory.unshift(command);
    }
    historyIndex = -1; // Reset history index after processing

    try {
      const response: string = await generateGeminiText(command);
      term?.write('\r\n'); // Add a newline before the AI response for better separation
      term?.write('\x1b[32mAI Response:\x1b[0m\r\n'); // Green text for AI Response
      // Split the response by lines and write each line to ensure proper wrapping and newlines
      response.split('\n').forEach(line => {
        term?.write(`${line}\r\n`);
      });
    } catch (error: any) { // Type 'any' for error caught from unknown source
      term?.write('\r\n'); // Add a newline before the error for better separation
      term?.write('\x1b[31mError:\x1b[0m '); // Red text for error
      term?.write((error.message || 'An unexpected error occurred.') + '\r\n');
    } finally {
      setIsProcessingCommand(false); // Clear loading state
      writePrompt(); // Show new prompt
    }
  };

  /**
   * Handles terminal resizing to fit its container.
   */
  const handleResize = (): void => {
    if (term && fitAddon) {
      fitAddon.fit();
    }
  };

  /**
   * Cleans up the terminal instance and associated resources.
   */
  const dispose = (): void => {
    if (term) {
      term.dispose();
      term = undefined; // Clear reference
    }
    if (fitAddon) {
      fitAddon = undefined; // Clear reference
    }
  };

  onCleanup(() => {
    dispose();
  });

  return {
    terminalOpen,
    setTerminalOpen,
    toggleTerminal,
    term,
    initialize,
    handleResize,
    dispose,
    isProcessingCommand, // Exposed directly as an Accessor
  };
}
