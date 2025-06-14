import { atom, computed } from 'nanostores';

export const editorContent = atom<string>('');
export const editorFilePath = atom<string>('');
export const editorLanguage = atom<string>('');
export const editorOriginalContent = atom<string>('');
export const editorHistory = atom<string[]>([]);
export const editorFuture = atom<string[]>([]);
export const editorNewPath = atom<string>('');
export const editorOpenTabs = atom<string[]>([]);
export const editorUnsaved = atom<Record<string, boolean>>({});

export const isDirty = computed(
  [editorFilePath, editorContent, editorOriginalContent],
  (filePath, content, original) => {
    return content !== original || editorUnsaved.get()[filePath] === true;
  },
);
