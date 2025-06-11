import type { JSX } from 'solid-js';
import { For, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';
import MarkdownViewer from './MarkdownViewer';
import ToggleSwitch from './ui/ToggleSwitch';

type GenerateDocumentationProps = {
  prompt: () => string;
  setPrompt: (val: string) => void;
  topic: () => string;
  setTopic: (val: string) => void;
  topicOptions: string[];
  language: () => string;
  setLanguage: (val: string) => void;
  languageOptions: { code: string; label: string }[];
  isComment: () => boolean;
  setIsComment: (val: boolean) => void;
  handleSubmit: () => void;
  loading: () => boolean;
  error: () => string;
  generatedContent: string | null;
};

export default function GenerateDocumentation(props: GenerateDocumentationProps): JSX.Element {
  return (
    <div class="md:w-3/4 space-y-4 rounded-lg border p-6 bg-gray-800/10 border-gray-500/30">
      <label class="block mb-1 text-lg font-medium">Prompt</label>
      <textarea
        rows={4}
        class="w-full p-3 min-h-[160px] border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Paste your code snippet here..."
        value={props.prompt()}
        onInput={(e) => props.setPrompt(e.currentTarget.value)}
      />

      <div>
        <label class="block mb-1 text-sm font-medium">Topic (Framework)</label>
        <select
          class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
          value={props.topic()}
          onChange={(e) => props.setTopic(e.currentTarget.value)}
        >
          <For each={props.topicOptions}>{(topic) => <option value={topic}>{topic}</option>}</For>
        </select>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Programming Language</label>
        <select
          class="w-full p-2 border border-gray-500/30 bg-sky-100 text-gray-950 rounded-md"
          value={props.language()}
          onChange={(e) => props.setLanguage(e.currentTarget.value)}
        >
          <For each={props.languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
        </select>
      </div>

      <div class="flex items-center gap-2 mt-1">
        <ToggleSwitch label="Inline Comments" checked={props.isComment()} onChange={props.setIsComment} />
      </div>

      <Button
        class="px-4 py-3 w-full text-xl mt-2 mb-6 gap-4 disabled:bg-gray-200"
        onClick={props.handleSubmit}
        variant="secondary"
        disabled={props.loading()}
      >
        <Icon icon="mdi:file-document-outline" width="2.2em" height="2.2em" />
        {props.loading() ? 'Generating...' : 'Generate Documentation'}
      </Button>

      <Show when={props.error()}>
        <p class="text-red-500">{props.error()}</p>
      </Show>
      <Show when={props.generatedContent}>
        <div class="">
          <MarkdownViewer content={props.generatedContent} />
        </div>
      </Show>
    </div>
  );
}
