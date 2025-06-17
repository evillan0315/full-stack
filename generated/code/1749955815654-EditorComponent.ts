import { createEffect, onMount, onCleanup, type JSX, Show, createMemo } from 'solid-js';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useStore } from '@nanostores/solid';

import { theme } from '../../stores/theme';
import { detectLanguage } from '../../utils/editorLanguage';
import { getThemeExtension } from '../../utils/editorTheme';
import { undoEdit, redoEdit } from '../../utils/editorUndoRedo';
import { editorContent, editorFilePath } from '../../stores/editorContent';
import MarkdownViewer from './MarkdownViewer';

type EditorComponentProps = {
  onSave?: () => void;
  onChange?: (content: string) => void;
};

const EditorComponent = (props: EditorComponentProps): JSX.Element => {
  let editorContainer: HTMLDivElement | undefined;
  let editorView: EditorView | null = null;

  const $theme = useStore(theme);
  const $content = useStore(editorContent);
  const $filePath = useStore(editorFilePath);

  const isMarkdown = createMemo(() => {
    const filePath = $filePath();
    return filePath ? filePath.endsWith('.md') || filePath.endsWith('.markdown') : false;
  });

  const themeCompartment = new Compartment();
  const langCompartment = new Compartment();

  // Initialize editor
  createEffect(() => {
    if (editorContainer && !editorView && !isMarkdown()) {
      editorView = new EditorView({
        state: EditorState.create({
          doc: $content(),
          extensions: [
            basicSetup,
            langCompartment.of(detectLanguage($filePath())),
            themeCompartment.of(getThemeExtension($theme())),
            EditorView.lineWrapping,
            EditorView.updateListener.of((v) => {
              if (v.docChanged) {
                const newCode = v.state.doc.toString();
                editorContent.set(newCode);
                props.onChange?.(newCode);
              }
            }),
          ],
        }),
        parent: editorContainer,
      });
    }
  });

  // Update content dynamically
  createEffect(() => {
    if (editorView && !isMarkdown()) {
      const current = editorView.state.doc.toString();
      if (current !== $content()) {
        editorView.dispatch({
          changes: { from: 0, to: current.length, insert: $content() },
        });
      }
    }
  });

  // Clear content when no file is open
  createEffect(() => {
    if (editorView && !$filePath() && !isMarkdown()) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: '' },
      });
    }
  });

  // Update language dynamically
  createEffect(() => {
    if (editorView && !isMarkdown()) {
      editorView.dispatch({
        effects: langCompartment.reconfigure(detectLanguage($filePath())),
      });
    }
  });

  // Update theme dynamically
  createEffect(() => {
    if (editorView && !isMarkdown()) {
      editorView.dispatch({
        effects: themeCompartment.reconfigure(getThemeExtension($theme())),
      });
    }
  });

  // Handle shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      props.onSave?.();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoEdit();
    } else if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))
    ) {
      e.preventDefault();
      redoEdit();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onCleanup(() => {
    editorView?.destroy();
    editorView = null;
    window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    
      
        
          <Show when={isMarkdown()}>
            <MarkdownViewer content={$content()} />
          </Show>
          <Show when={!isMarkdown()}>
            <div ref={(el) => (editorContainer = el)} class="h-full w-full" />
          </Show>
        
      
    
  );
};

export default EditorComponent;


// src/components/MarkdownViewer.tsx
import { createEffect, onCleanup } from 'solid-js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-http';

import '../styles/markdown.css';

interface MarkdownViewerProps {
  content: string;
}
interface Code {
  text: string;
  lang: string | undefined;
  escaped?: boolean;
}
export default function MarkdownViewer(props: MarkdownViewerProps) {
  let container: HTMLDivElement | undefined;

  const renderer = new marked.Renderer();

  renderer.code = ({ text, lang, escaped }): string => {
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }
    return `<pre><code>${text}</code></pre>`;
  };

  marked.setOptions({ renderer });

  createEffect(async () => {
    if (container) {
      container.innerHTML = '';

      const html = await marked.parse(props.content);
      container.innerHTML = html;

      const blocks = container.querySelectorAll('pre');

      blocks.forEach((block) => {
        const code = block.querySelector('code');
        if (!code || block.parentElement?.classList.contains('markdown-wrapper')) return;

        const langClass = code.className.match(/language-(\w+)/);
        const lang = langClass ? langClass[1] : '';

        const langMap: Record<string, string> = {
          js: 'JavaScript',
          ts: 'TypeScript',
          py: 'Python',
          sh: 'Shell',
          bash: 'Bash',
          http: 'Http',
          html: 'HTML',
          css: 'CSS',
          json: 'JSON',
          yaml: 'YAML',
        };

        const displayLang = langMap[lang] || (lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : '');

        const wrapper = document.createElement('div');
        wrapper.className = 'relative group my-4';

        const langTag = document.createElement('div');
        langTag.textContent = displayLang;
        langTag.className =
          'absolute top-0 left-0 bg-sky-600 text-sm font-bold px-2 py-1 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-150';

        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy code';
        copyButton.className =
          'absolute top-0 right-0 p-1 text-sm rounded-bl-md bg-sky-500 hover:bg-sky-600 hover:text-white transition-opacity opacity-0 group-hover:opacity-100';

        copyButton.addEventListener('click', () => {
          const text = code.innerText;
          if (text) {
            navigator.clipboard.writeText(text);
            copyButton.textContent = '✅';
            setTimeout(() => (copyButton.textContent = '📋'), 1000);
          }
        });

        const cloned = block.cloneNode(true);
        wrapper.appendChild(langTag);
        wrapper.appendChild(copyButton);
        wrapper.appendChild(cloned);
        block.replaceWith(wrapper);
      });
    }
  });

  onCleanup(() => {
    if (container) container.innerHTML = '';
  });

  return (
    
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans p-6"
        ref={(el) => (container = el)}
      />
    
  );
}
