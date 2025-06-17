import { Button } from '../ui/Button';
import DropdownMenu from '../ui/DropdownMenu';
import {
  formatCode,
  optimize,
  analyze,
  repair,
  handleRemoveComments,
  handleGenerateDocumentation,
  handleGenerateCode,
  handleDrawer,
} from './editorActions';

interface Props {
  toggleTerminal: () => void;
  setDrawerOpen: (open: boolean) => void;
  setChatDrawerOpen: (open: boolean) => void;
  setDocDrawerOpen: (open: boolean) => void;
  docFileExists: () => boolean;
  setMarkdownDrawerOpen:()=>void;
  toggleTerminal: (mode: 'none' | 'ai' | 'local') => void;
  activeTerminal: Accessor<'none' | 'ai' | 'local'>; // Use Accessor for reactive state
}

export default function EditorActionButtons(props: Props) {
  return (
    <div class="flex items-center justify-center gap-2">
      <DropdownMenu
        variant="secondary"
        icon="mdi:code"
        items={[
          { label: 'Remove Comments', icon: 'mdi:comment-remove', onClick: handleRemoveComments },
          { label: 'Inline Documentation', icon: 'mdi:book-open-page-variant', onClick: handleGenerateDocumentation },
          {
            label: 'Generate Documentation',
            icon: 'mdi:book-open-variant',
            onClick: () => props.setDocDrawerOpen(true),
          },
          {
            label: 'Load Documentation',
            icon: 'mdi:file-document',
            disabled: !props.docFileExists(),
            onClick: () => {
              const { editorFilePath } = require('../../stores/editorContent');
              const newDocPath = editorFilePath.get().replace(/\.[^/.]+$/, '.md');
              editorFilePath.set(newDocPath);
              document.dispatchEvent(new CustomEvent('editor-load-file', { detail: { newDocPath } }));
            },
          },
        ]}
      />
      <DropdownMenu
        variant="secondary"
        icon="mdi:wand"
        items={[
          { label: 'Format Code', icon: 'mdi:format-align-right', onClick: formatCode },
          { label: 'Chat Generate', icon: 'mdi:chat', onClick: () => props.setChatDrawerOpen(true) },
          { label: 'Generate Code', icon: 'mdi:code', onClick: () => props.setDrawerOpen(true) },
          { label: 'Code Tools', type:"divider", icon: 'mdi:tools' },
          { label: 'Optimize Code', icon: 'mdi:code-block-braces', onClick: optimize },
          { label: 'Analyze Code', icon: 'mdi:code-block-parentheses', onClick: analyze },
          { label: 'Repair Code', icon: 'mdi:code-tags-check', onClick: repair },
        ]}
      />
      <Button icon="mdi:markdown" variant="secondary" onClick={props.setMarkdownDrawerOpen} />
      {/* AI Terminal Toggle Button */}
      <Button
        variant={props.activeTerminal() === 'ai' ? 'primary' : 'secondary'}
        icon="mdi:robot-happy-outline"
        onClick={() => props.toggleTerminal('ai')}
        class="p-0"
        title="Toggle AI Terminal"
      />

      {/* Local Terminal Toggle Button */}
      <Button
        variant={props.activeTerminal() === 'local' ? 'primary' : 'secondary'}
        icon="mdi:console" // Example icon for local terminal
        onClick={() => props.toggleTerminal('local')}
        class="p-0"
        title="Toggle Local Terminal"
      />
      
  
      <Button
        icon="mdi:content-save"
        variant="secondary"
        onClick={() => require('../../hooks/useEditorFile').useEditorFile().saveFile()}
      />
    </div>
  );
}
