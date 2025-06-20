import { type Component, createSignal, Show, For, onMount, onCleanup, createEffect } from 'solid-js';
import { Button } from '../ui/Button';
import { Icon } from '@iconify-icon/solid';
import * as path from 'path-browserify';
import { prompt, alert } from '../../services/modalService';
import Tooltip from '../ui/Tooltip';
interface FileManagerHeaderProps {
  currentDirectory: () => string;
  fetchDirectory: (dir: string) => void;
  createFile: (directory: string, fileName: string) => Promise<void>;
  createFolder: (directory: string, folderName: string) => Promise<void>;
}

const FileManagerHeader: Component<FileManagerHeaderProps> = (props) => {
  const [showDropdown, setShowDropdown] = createSignal(false);
  const [recentDirectories, setRecentDirectories] = createSignal<string[]>([]);

  const toggleDropdown = () => setShowDropdown(!showDropdown());

  const handleDirectorySelect = (directory: string) => {
    props.fetchDirectory(directory);
    setShowDropdown(false);
  };

  createEffect(() => {
    const current = props.currentDirectory();
    if (current && !recentDirectories().includes(current)) {
      setRecentDirectories((prev) => {
        const updated = [current, ...prev.filter((d) => d !== current)];
        return updated.slice(0, 5);
      });
    }

    localStorage.setItem('recentDirectories', JSON.stringify(recentDirectories()));
  });

  const handleClickOutside = (e: MouseEvent) => {
    const dropdownMenu = document.getElementById('directory-dropdown-menu');
    const browseButton = document.getElementById('browse-directory-button');
    if (
      dropdownMenu &&
      !dropdownMenu.contains(e.target as Node) &&
      browseButton &&
      !browseButton.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const handleNewFile = async () => {
    const fileName = await prompt('Enter name for new file:', '', 'info');
    if (!fileName) {
      await alert('File name cannot be empty.', 'warning');
      return;
    }
    try {
      await props.createFile(props.currentDirectory(), fileName);
    } catch (err) {
      console.error('Error creating file:', err);
    }
  };

  const handleNewFolder = async () => {
    const folderName = await prompt('Enter name for new folder:', '', 'info');
    if (!folderName) {
      await alert('Folder name cannot be empty.', 'warning');
      return;
    }
    try {
      await props.createFolder(props.currentDirectory(), folderName);
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  onMount(() => {
    const savedRecents = localStorage.getItem('recentDirectories');
    if (savedRecents) {
      setRecentDirectories(JSON.parse(savedRecents));
    }
    document.addEventListener('click', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return (
    <>
      <div class="flex items-center justify-start gap-2 min-w-0">
        <div class="flex items-center gap-2 relative min-w-0 flex-grow">
          <Button
            icon="mdi:arrow-left"
            variant="secondary"
            onClick={() => {
              const parent = path.dirname(props.currentDirectory() || '/');
              if (parent !== props.currentDirectory()) {
                props.fetchDirectory(parent);
                setShowDropdown(false);
              }
            }}
            title="Go up directory"
          />
          <Button
            id="browse-directory-button"
            icon="mdi:folder-open"
            variant="secondary"
            onClick={toggleDropdown}
            title="Browse Directory"
          />
          <Show when={showDropdown()}>
            <div
              id="directory-dropdown-menu"
              class="absolute top-full left-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 py-1"
            >
              <div
                class="flex gap-2 items-center px-3 cursor-pointer hover:bg-gray-700"
                onClick={() => handleDirectorySelect(props.currentDirectory())}
              >
                Current:{' '}
                <span class="font-semibold truncate max-w-[150px] inline-block">{props.currentDirectory()}</span>
              </div>
              <div class="border-t border-gray-800 my-1"></div>

              <p class="text-xs text-gray-400 px-3 pt-1 pb-1">Recent Directories:</p>
              <For each={recentDirectories()}>
                {(dir) => (
                  <div
                    class="px-3 py-1 cursor-pointer hover:bg-gray-700 text-sm truncate"
                    onClick={() => handleDirectorySelect(dir)}
                    title={dir}
                  >
                    {dir}
                  </div>
                )}
              </For>
              <Show when={recentDirectories().length === 0}>
                <p class="text-xs text-gray-500 px-3 py-1">No recent directories.</p>
              </Show>

              <div class="border-t border-gray-800 my-1"></div>

              <div
                class="px-3 py-1 cursor-pointer hover:bg-gray-700 text-sm flex items-center gap-2"
                onClick={() => {
                  const parent = path.dirname(props.currentDirectory() || '/');
                  if (parent !== props.currentDirectory()) {
                    props.fetchDirectory(parent);
                    setShowDropdown(false);
                  }
                }}
              >
                <Icon icon="mdi:arrow-up-bold" class="text-gray-400" /> Go Up
              </div>
            </div>
          </Show>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          {' '}
          <Button
            icon="mdi:refresh"
            variant="secondary"
            size="sm"
            onClick={() => props.fetchDirectory(props.currentDirectory() || '/')}
            title="Refresh Current Directory"
          />
          <Button icon="mdi:file-plus" variant="secondary" size="sm" onClick={handleNewFile} title="New File" />
          <Button icon="mdi:folder-plus" variant="secondary" size="sm" onClick={handleNewFolder} title="New Folder" />
        </div>
      </div>
    </>
  );
};

export default FileManagerHeader;
