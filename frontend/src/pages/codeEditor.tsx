import { createSignal, Show, onMount, createEffect } from 'solid-js';
import Editor from '../components/common/Editor';
import Header from '../components/Header';
import api from '../services/api';
export default function CodeEditor() {
  
  const [previewContent, setPreviewContent] = createSignal('');
  const [dividerX, setDividerX] = createSignal(0); // Will be initialized on mount
  const [showResizer, setShowResizer] = createSignal(false);

  onMount(() => {
    // Default to 50% of the window width on mount
    setDividerX(window.innerWidth / 2);
  });

  const handleEditorSave = () => {
    //setDividerX(clientX);
  };

  const toggleResize = (res: boolean) => {
    if (res && dividerX() === 0) {
      setDividerX(window.innerWidth / 2);
    }
    setShowResizer(res);
  };
  const getPreviewContent = (res: string, mimeType: string) => {
    setPreviewContent(res);
  };
  createEffect(() => {
    (async () => {
      try {
        
      } catch (err) {
        console.error('Error loading file into Monaco:', err);
      }
    })();
  });
  return (
    <div class="flex h-screen  flex-col bg-white dark:bg-neutral-900 dark:text-white">
      <Header />
 
            <Editor filePath="./frontend/index.html" language="typescript"
             
            />
          
     


      
    </div>
  );
}
