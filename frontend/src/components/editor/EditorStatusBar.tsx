import { createMemo, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { editorFilePath, editorLanguage, editorUnsaved } from '../../stores/editorContent';
import { Icon } from '@iconify-icon/solid';

export const EditorStatusBar = () => {
  const $filePath = useStore(editorFilePath);
  const $language = useStore(editorLanguage);
  const $unsaved = useStore(editorUnsaved);

  const fileName = createMemo(() => {
    const path = $filePath();
    return path ? path.split('/').pop() : '';
  });

  const status = createMemo(() => {
    const path = $filePath();
    if (!path) return 'No file';
    return $unsaved()[path] ? 'Unsaved Changes' : 'No changes.';
  });

  return (
    <Show when={$filePath()}>
      <div class="flex items-center justify-between gap-3 text-xs px-2">
        <div class="flex flex-inline items-center justify-center  gap-1" title={$filePath() || 'No file open'}>
          <Icon icon="mdi:file" width="1.2em" height="1.2em" />{' '}
          <span title={$filePath()} class="truncate max-w-[200px] inline-block">
            {fileName() || 'No file open'}
          </span>
        </div>
        <div class="flex flex-inline items-center justify-center gap-1" title={$language() || 'No language detected'}>
          <Icon icon="mdi:document" width="1.2em" height="1.2em" />{' '}
          <span title={$language()} class="truncate max-w-[200px] inline-block">
            {$language() || 'N/A'}
          </span>
        </div>
        <div class={status() === 'Unsaved Changes' ? 'text-red-500' : ''}>Status: {status()}</div>
      </div>
    </Show>
  );
};
