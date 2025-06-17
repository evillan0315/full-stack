import { editorUnsaved } from '../stores/editorContent';
import { confirm } from '../services/modalService';

/**
 * Checks if the file has unsaved changes and prompts user for confirmation to discard them.
 * @param path File path to check.
 * @returns Promise that resolves to true if it's okay to proceed (discard changes), false otherwise.
 */
export async function confirmDiscardIfUnsaved(path: string): Promise<boolean> {
  if (!path) return true;

  const unsavedMap = editorUnsaved.get();

  if (unsavedMap?.[path]) {
    const proceed = await confirm(`You have unsaved changes in "${path}". Discard changes and continue?`);
    return !!proceed;
  }

  return true;
}

