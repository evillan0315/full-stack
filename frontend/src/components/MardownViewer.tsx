import { createEffect, onCleanup } from 'solid-js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // for HTML
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-http';

import '../styles/markdown.css'; // Your custom styles including Prism theme

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer(props: MarkdownViewerProps) {
  let container: HTMLDivElement | undefined;

  createEffect(() => {
    if (container) {
      marked.setOptions({
        highlight: (code, lang) => {
          if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
          }
          return code;
        },
      });

      container.innerHTML = marked.parse(props.content);

      const blocks = container.querySelectorAll('pre');

      blocks.forEach((block) => {
        const code = block.querySelector('code');
        const langClass = code?.className.match(/language-(\w+)/);
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
          'absolute top-0 left-0 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-150';

        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy code';
        copyButton.className =
          'absolute top-0 right-0 p-1 text-xs rounded-bl-md bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100';

        copyButton.addEventListener('click', () => {
          const text = code?.innerText;
          if (text) {
            navigator.clipboard.writeText(text);
            copyButton.textContent = '✅';
            setTimeout(() => {
              copyButton.textContent = '📋';
            }, 1000);
          }
        });

        const cloned = block.cloneNode(true);
        wrapper.appendChild(langTag);
        wrapper.appendChild(copyButton);
        wrapper.appendChild(cloned);
        block.replaceWith(wrapper);
      });

      Prism.highlightAllUnder(container);
    }
  });

  onCleanup(() => {
    if (container) container.innerHTML = '';
  });

  return (
    <div>
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans text-neutral-200"
        ref={(el) => (container = el)}
      />
    </div>
  );
}
