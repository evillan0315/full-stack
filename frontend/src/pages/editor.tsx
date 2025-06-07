// src/pages/editor.tsx

import { createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js'; // Component type is not used here, can be removed
import { Icon } from '@iconify-icon/solid';
import { useAuth } from '../contexts/AuthContext';
import EditorComponent from '../components/EditorComponent';
// import FileManager from '../components/FileManager'; // No longer needed here
import FileManagerContainer from '../components/FileManagerContainer';
import GridResizer from '../components/GridResizer';
import TerminalDrawer from '../components/TerminalDrawer';
import FileTabs from '../components/FileTabs';
import api from '../services/api';

/**
 * The main `Editor` page component that provides:
 * - A file manager panel for selecting files
 * - A code editor panel with syntax highlighting
 * - A resizable layout controlled by a grid resizer
 * - An optional terminal drawer for command execution
 */
export default function Editor() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = createSignal(false);

  // Use fileContent and filePath for the currently displayed file in the editor
  // The filePath here will be the `activeTab()`
  const [fileContent, setFileContent] = createSignal<string>('');

  // State for layout resizing
  const [left, setLeft] = createSignal(0.225); // Initial flex-grow ratio for file manager
  const isHorizontal = () => false; // Determines if the split is horizontal or vertical

  // Refs for grid resizing
  let gridRef!: HTMLDivElement; // Main container for grid layout
  let resizerRef!: HTMLDivElement; // Ref for the resizer element itself

  // States for managing open files and active tab
  const [openTabs, setOpenTabs] = createSignal<string[]>([]);
  const [activeTab, setActiveTab] = createSignal<string>('');

  /**
   * Handles resizing of the file manager/editor split pane.
   * @param clientX - Mouse X coordinate
   * @param clientY - Mouse Y coordinate
   */
  const changeLeft = (clientX: number, clientY: number) => {
    // Ensure gridRef and resizerRef are available
    if (!gridRef || !resizerRef) return;

    const rect = gridRef.getBoundingClientRect();
    let position: number;
    let size: number;

    if (isHorizontal()) {
      // For horizontal split (top/bottom panels)
      position = clientY - rect.top - resizerRef.offsetHeight / 2;
      size = gridRef.offsetHeight - resizerRef.offsetHeight;
    } else {
      // For vertical split (left/right panels)
      position = clientX - rect.left - resizerRef.offsetWidth / 2;
      size = gridRef.offsetWidth - resizerRef.offsetWidth;
    }

    // Calculate percentage and constrain it to a reasonable range
    const percentage = position / size;
    const percentageAdjusted = Math.min(Math.max(percentage, 0.1), 0.75); // Min 10%, Max 75%

    setLeft(percentageAdjusted);
  };

  /**
   * Loads file content from the backend for a given path.
   * Also manages open tabs and active tab state.
   * @param path - Path to the file being loaded
   */
  const loadFile = async (path: string) => {
    // If the path is already the active tab and content is loaded, do nothing
    if (path === activeTab() && fileContent()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('filePath', path);
      console.log(formData, 'formData loadFile');
      console.log(path, 'path loadFile');
      // Assuming `api.post` returns a structure like { data: { data: "file_content" } }
      const response = await api.post('/file/read', formData);
      console.log(response.data, 'loadFile response.data');
      // Check if response.data or response.data.data exists and is a string
      if (!response.data || typeof response.data.content !== 'string') {
        throw new Error('Invalid file content format received from API');
      }

      setFileContent(response.data.content);

      // Add to tabs if not already open
      setOpenTabs((tabs) => {
        if (!tabs.includes(path)) {
          return [...tabs, path];
        }
        return tabs;
      });
      setActiveTab(path); // Set the newly loaded file as the active tab
    } catch (err) {
      console.error(`Error loading file "${path}":`, err);
      // Display error message to user, clear content or show a placeholder
      setFileContent(`Error loading file: ${(err as any).response?.data?.message || (err as Error).message}`);
      // Optionally remove the tab if loading failed
      // setOpenTabs((tabs) => tabs.filter((t) => t !== path));
      // setActiveTab(openTabs().length > 0 ? openTabs()[0] : '');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect to handle initial authentication and initial file loading.
   */
  onMount(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    } else {
      // Optionally load a default file (e.g., README.md) on initial mount
      // Only if no tab is active or no files are open
      if (openTabs().length === 0 && !activeTab()) {
        loadFile('/media/eddie/Data/projects/nestJS/nest-modules/project-board/README.md'); // Or any other default file
      }
    }

    // No need for updateWidths if flexbox handles it and resizer manages proportions
    // window.addEventListener('resize', updateWidths); // Removed as it's not directly used for flex layout
  });

  onCleanup(() => {
    // window.removeEventListener('resize', updateWidths); // Removed corresponding cleanup
  });

  // Effect to update EditorComponent's content when activeTab changes
  createEffect(() => {
    if (activeTab() && !isLoading()) {
      // You might not need to reload here if loadFile already handles activeTab change.
      // This effect would be for if `fileContent` was managed externally.
      // Since `loadFile` sets `fileContent`, this effect might be redundant or for complex sync scenarios.
      // If EditorComponent needs to react directly to `activeTab` changing for non-content reasons, keep it.
      // If EditorComponent uses `filePath` and `fileContent` signals, it will react automatically.
    }
  });

  return (
    <div
      ref={gridRef} // Assign ref to the main grid container
      class="flex h-[calc(100vh-5rem)] min-h-0 flex-1 flex-col font-sans bg-gray-900 text-white"
      classList={{
        'md:flex-row': !isHorizontal(), // Apply flex-row for horizontal panels
        'dark': true, // Keep dark mode class if always dark
      }}
    >
      {/* File Manager Container */}
      {/* FIX: Removed FileManager={FileManager} as it's not a valid prop */}
      <FileManagerContainer left={left} loadFile={loadFile} />

      {/* Grid Resizer */}
      <GridResizer ref={resizerRef} isHorizontal={isHorizontal()} onResize={changeLeft} />

      {/* Code Editor Panel */}
      <div class="flex min-h-0 min-w-0 flex-col overflow-auto" style={`flex: ${1 - left()}`}>
        {/* File Tabs */}
        <FileTabs
          openTabs={openTabs()}
          activeTab={activeTab()}
          onTabClick={(path) => {
            setActiveTab(path);
            loadFile(path); // Load content when tab is clicked
          }}
          onTabClose={(closedPath) => {
            setOpenTabs((tabs) => tabs.filter((t) => t !== closedPath));
            if (closedPath === activeTab()) {
              const remaining = openTabs().filter((t) => t !== closedPath);
              if (remaining.length > 0) {
                // Load the last remaining tab
                loadFile(remaining[remaining.length - 1]);
              } else {
                // No tabs left, clear editor
                setActiveTab('');
                setFileContent('');
              }
            }
          }}
        />
        {/* Editor Component */}
        <EditorComponent
          filePath={activeTab()} // Pass the path of the active tab
          initialContent={fileContent()} // Pass the loaded content
          isLoading={isLoading()} // Pass loading state
          // Add any other props EditorComponent expects, e.g., onSave, language etc.
        />
      </div>

      {/* Integrated Terminal Drawer */}
      <TerminalDrawer position="bottom" size="200px" fontSize={12} resizable={true} draggable={false} />
    </div>
  );
}
