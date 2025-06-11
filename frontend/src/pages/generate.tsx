import { createSignal, Show } from 'solid-js';
import { PageHeader } from '../components/ui/PageHeader';
import GenerateDocumentationPage from './documentation';
import TTSForm from './tts';
import MarkdownViewer from '../components/MarkdownViewer';
import { Icon } from '@iconify-icon/solid';
import Loading from '../components/Loading';
import api from '../services/api';

export default function GeneratePage() {
  const [activeTab, setActiveTab] = createSignal<'doc' | 'tts'>('doc');

  // Shared state for documentation generation
  const [prompt, setPrompt] = createSignal('');
  const [topic, setTopic] = createSignal('React');
  const [language, setLanguage] = createSignal('ts');
  const [isComment, setIsComment] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [content, setContent] = createSignal('');
  const [error, setError] = createSignal('');

  const topicOptions = ['React', 'SolidJS', 'NestJS', 'Vue', 'Angular'];
  const languageOptions = [
    { code: 'ts', label: 'TypeScript' },
    { code: 'js', label: 'JavaScript' },
    { code: 'py', label: 'Python' },
    { code: 'java', label: 'Java' },
  ];

  const handleSubmitDoc = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/google-gemini/generate-doc', {
        codeSnippet: prompt(),
        language: language(),
        topic: topic(),
        isComment: isComment(),
      });
      if (!response.data) throw new Error('No documentation generated');
      setContent(response.data);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-4 space-y-6">
      <PageHeader icon="mdi:wand">
        <h1 class="leading-0 uppercase tracking-widest text-2xl">
          <b>Generate</b> AI Content
        </h1>
      </PageHeader>

      <div class="flex gap-2 border-b border-gray-600">
        <button
          class={`flex items-center justify-center gap-2 px-4 py-2 font-medium ${activeTab() === 'doc' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('doc')}
        >
          <Icon icon="mdi:code" width="20" height="20" /> Code Doc
        </button>
        <button
          class={`flex items-center justify-center gap-2 px-4 py-2 font-medium ${activeTab() === 'tts' ? 'border-b-2 border-blue-500 ' : ''}`}
          onClick={() => setActiveTab('tts')}
        >
          <Icon icon="mdi:tts" width="20" height="20" /> Text To Speech
        </button>
      </div>

      <Show when={activeTab() === 'doc'}>
        <GenerateDocumentationPage />
      </Show>

      <Show when={activeTab() === 'tts'}>
        <TTSForm />
      </Show>
    </div>
  );
}
