import { createSignal, onMount, Show, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';

import DropdownMenu from '../components/ui/DropdownMenu';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import GridResizer from '../components/GridResizer';
import TerminalShell from '../components/TerminalShell';
import { EditorStatusBar } from '../components/editor/EditorStatusBar';
import { EditorBottomNav } from '../components/editor/EditorBottomNav';
import EditorLayout from '../components/layouts/editor/EditorLayout';
import {
  editorOriginalContent,
  editorFilePath,
  editorOpenTabs,
  editorContent,
  editorUnsaved,
} from '../stores/editorContent';
import { showToast } from '../stores/toast';

import FileTabs from '../components/file/FileTabs';
import { useEditorFile } from '../hooks/useEditorFile';
import EditorContainer from '../components/editor/EditorContainer';
import FileManagerContainer from '../components/file/FileManagerContainer';

export default function Editor() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <EditorLayout leftSidebar={true} rightSidebar={false} content={<EditorContainer />} />
    </>
  );
}
