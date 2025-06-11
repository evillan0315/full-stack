// File: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/frontend/src/components/MarkdownViewer.tsx

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

/**
 * Interface defining the props for the MarkdownViewer component.
 */
interface MarkdownViewerProps {
  /**
   * The markdown content to be rendered.  This string will be parsed and displayed as HTML.
   */
  content: string;
}

/**
 * A Solid.js component that renders markdown content with syntax highlighting.
 *
 * It uses `marked` to parse the markdown and `Prism.js` to highlight code blocks.
 * A copy button is added to each code block for easy copying of the code.
 *  It also displays the language of the code block if available.
 *
 * @param {MarkdownViewerProps} props - The props for the component, containing the markdown content.
 * @returns {JSX.Element} A JSX element representing the rendered markdown viewer.
 */
export default function MarkdownViewer(props: MarkdownViewerProps) {
  /**
   * A reference to the div element that will contain the rendered markdown.
   * This allows manipulation of the element after it is mounted.
   */
  let container: HTMLDivElement | undefined;

  /**
   * A Solid.js effect that runs when the component is mounted and whenever the `content` prop changes.
   * It parses the markdown content using `marked`, highlights the code blocks using `Prism.js`,
   * and adds a copy button to each code block.
   */
  createEffect(() => {
    if (container) {
      /**
       * Configures `marked` to use `Prism.js` for syntax highlighting.
       * @param code The code to be highlighted.
       * @param lang The language of the code.
       * @returns The highlighted code as HTML.
       */
      marked.setOptions({
        highlight: (code, lang) => {
          if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
          }
          return code;
        },
      });

      // Parse the markdown content and set the innerHTML of the container.
      container.innerHTML = marked.parse(props.content);

      /**
       * Selects all `pre` elements (code blocks) within the container.
       */
      const blocks = container.querySelectorAll('pre');

      /**
       * Iterates over each code block and adds a copy button and language tag.
       */
      blocks.forEach((block) => {
        const code = block.querySelector('code');
        const langClass = code?.className.match(/language-(\w+)/);
        const lang = langClass ? langClass[1] : '';

        /**
         * A map to display user-friendly language names.
         */
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

        // Determine the language name to display.
        const displayLang = langMap[lang] || (lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : '');

        // Create a wrapper div for the code block.
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group my-4';

        // Create a language tag div.
        const langTag = document.createElement('div');
        langTag.textContent = displayLang;
        langTag.className =
          'absolute top-0 left-0 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity duration-150';

        // Create a copy button.
        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.title = 'Copy code';
        copyButton.className =
          'absolute top-0 right-0 p-1 text-xs rounded-bl-md bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition-opacity opacity-0 group-hover:opacity-100';

        /**
         * Adds a click event listener to the copy button to copy the code to the clipboard.
         */
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

        // Clone the original block to prevent modification to the original node.
        const cloned = block.cloneNode(true);
        wrapper.appendChild(langTag);
        wrapper.appendChild(copyButton);
        wrapper.appendChild(cloned);
        block.replaceWith(wrapper);
      });

      /**
       * Highlights all code blocks within the container using `Prism.js`.
       */
      Prism.highlightAllUnder(container);
    }
  });

  /**
   * A Solid.js cleanup effect that runs when the component is unmounted.
   * It clears the innerHTML of the container to prevent memory leaks.
   */
  onCleanup(() => {
    if (container) container.innerHTML = '';
  });

  return (
    <div class="markdown-wrapper">
      <div
        class="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none font-sans"
        ref={(el) => (container = el)}
      />
    </div>
  );
}
