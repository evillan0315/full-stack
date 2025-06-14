import { useStore } from '@nanostores/solid';
import { createMemo } from 'solid-js';
import { editorFilePath, editorLanguage, editorUnsaved } from '../../stores/editorContent';

export const EditorStatusBar = () => {
  const $filePath = useStore(editorFilePath);
  const $language = useStore(editorLanguage);
  const $unsaved = useStore(editorUnsaved);

  // Use createMemo to compute fileName reactively
  const fileName = createMemo(() => {
    const path = $filePath();
    return path ? path.split('/').pop() : '';
  });

  // Compute status reactively
  const status = createMemo(() => {
    const path = $filePath();
    if (!path) return 'No file';
    return $unsaved()[path] ? 'Unsaved Changes' : 'Saved';
  });

  return (
    <div class="flex items-center justify-between gap-3 text-sm px-2 py-1">
      <div class="truncate max-w-[200px]" title={$filePath() || 'No file open'}>
        File: {fileName() || 'No file open'}
      </div>
      <div>Language: {$language() || 'N/A'}</div>
      <div class={status() === 'Unsaved Changes' ? 'text-red-500' : ''}>
        Status: {status()}
      </div>
    </div>
  );
};

