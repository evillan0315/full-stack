import { createSignal, For } from 'solid-js';
import { Button } from '../components/ui/Button';
import { Icon } from 'solid-heroicons';
import { speakerWave } from 'solid-heroicons/outline';
import Header from '../components/Header';

interface SpeakerConfig {
  speaker: string;
  voiceName: string;
}
const languageOptions = [
  { label: 'Arabic (Egyptian)', code: 'ar-EG' },
  { label: 'German (Germany)', code: 'de-DE' },
  { label: 'English (US)', code: 'en-US' },
  { label: 'Spanish (US)', code: 'es-US' },
  { label: 'French (France)', code: 'fr-FR' },
  { label: 'Hindi (India)', code: 'hi-IN' },
  { label: 'Indonesian (Indonesia)', code: 'id-ID' },
  { label: 'Italian (Italy)', code: 'it-IT' },
  { label: 'Japanese (Japan)', code: 'ja-JP' },
  { label: 'Korean (Korea)', code: 'ko-KR' },
  { label: 'Portuguese (Brazil)', code: 'pt-BR' },
  { label: 'Russian (Russia)', code: 'ru-RU' },
  { label: 'Dutch (Netherlands)', code: 'nl-NL' },
  { label: 'Polish (Poland)', code: 'pl-PL' },
  { label: 'Thai (Thailand)', code: 'th-TH' },
  { label: 'Turkish (Turkey)', code: 'tr-TR' },
  { label: 'Vietnamese (Vietnam)', code: 'vi-VN' },
  { label: 'Romanian (Romania)', code: 'ro-RO' },
  { label: 'Ukrainian (Ukraine)', code: 'uk-UA' },
  { label: 'Bengali (Bangladesh)', code: 'bn-BD' },
  { label: 'English (India)', code: 'en-IN' },
  { label: 'Marathi (India)', code: 'mr-IN' },
  { label: 'Tamil (India)', code: 'ta-IN' },
  { label: 'Telugu (India)', code: 'te-IN' },
];
const voiceOptions = [
  { name: 'Zephyr', tone: 'Bright' },
  { name: 'Puck', tone: 'Upbeat' },
  { name: 'Charon', tone: 'Informative' },
  { name: 'Kore', tone: 'Firm' },
  { name: 'Fenrir', tone: 'Excitable' },
  { name: 'Leda', tone: 'Youthful' },
  { name: 'Orus', tone: 'Firm' },
  { name: 'Aoede', tone: 'Breezy' },
  { name: 'Callirrhoe', tone: 'Easy-going' },
  { name: 'Autonoe', tone: 'Bright' },
  { name: 'Enceladus', tone: 'Breathy' },
  { name: 'Iapetus', tone: 'Clear' },
  { name: 'Umbriel', tone: 'Easy-going' },
  { name: 'Algieba', tone: 'Smooth' },
  { name: 'Despina', tone: 'Smooth' },
  { name: 'Erinome', tone: 'Clear' },
  { name: 'Algenib', tone: 'Gravelly' },
  { name: 'Rasalgethi', tone: 'Informative' },
  { name: 'Laomedeia', tone: 'Upbeat' },
  { name: 'Achernar', tone: 'Soft' },
  { name: 'Alnilam', tone: 'Firm' },
  { name: 'Schedar', tone: 'Even' },
  { name: 'Gacrux', tone: 'Mature' },
  { name: 'Pulcherrima', tone: 'Forward' },
  { name: 'Achird', tone: 'Friendly' },
  { name: 'Zubenelgenubi', tone: 'Casual' },
  { name: 'Vindemiatrix', tone: 'Gentle' },
  { name: 'Sadachbia', tone: 'Lively' },
  { name: 'Sadaltager', tone: 'Knowledgeable' },
  { name: 'Sulafat', tone: 'Warm' },
];

export default function TTSForm() {
  const [prompt, setPrompt] = createSignal('');
  const [languageCode, setLanguageCode] = createSignal('en-US');
  const [language, setLanguage] = createSignal('en-US');
  const [speakers, setSpeakers] = createSignal<SpeakerConfig[]>([
    { speaker: 'Eddie', voiceName: 'Kore' },
    { speaker: 'Marionette', voiceName: 'Puck' },
  ]);

  const [audioSrc, setAudioSrc] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const updateSpeaker = (index: number, field: keyof SpeakerConfig, value: string) => {
    const updated = [...speakers()];
    updated[index][field] = value;
    setSpeakers(updated);
  };

  const addSpeaker = () => setSpeakers([...speakers(), { speaker: '', voiceName: voiceOptions[0].name }]);

  const removeSpeaker = (index: number) => {
    const updated = [...speakers()];
    updated.splice(index, 1);
    setSpeakers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setAudioSrc(null);

    try {
      const response = await fetch('/api/google-tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt(),
          languageCode: language(),
          speakers: speakers(), // if applicable
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate audio');

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-white dark:bg-neutral-900 h-screen w-full">
      <Header />
      <div class="flex min-h-screen items-center justify-center">
        <div class="w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4 dark:bg-neutral-950 border dark:border-neutral-600">
          <h2 class="text-2xl font-bold dark:text-neutral-400">Generate TTS Audio</h2>

          <textarea
            rows={4}
            class="w-full p-3 min-h-[200px] border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-neutral-100"
            placeholder="Enter your prompt here..."
            value={prompt()}
            onInput={(e) => setPrompt(e.currentTarget.value)}
          />

          <div>
            <label class="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Language</label>
            <select
              class="w-full p-2 border rounded-md dark:bg-neutral-700 dark:text-white"
              value={language()}
              onChange={(e) => setLanguage(e.currentTarget.value)}
            >
              <For each={languageOptions}>{(lang) => <option value={lang.code}>{lang.label}</option>}</For>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block font-medium text-neutral-800 dark:text-neutral-200">Speakers</label>
            <For each={speakers()}>
              {(speaker, index) => (
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      class="w-1/2 p-2 border rounded-md dark:bg-neutral-700 dark:text-white"
                      placeholder="Speaker name"
                      value={speaker.speaker}
                      onInput={(e) => updateSpeaker(index(), 'speaker', e.currentTarget.value)}
                    />
                    <select
                      class="w-1/2 p-2 border rounded-md dark:bg-neutral-700 dark:text-white"
                      value={speaker.voiceName}
                      onChange={(e) => updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                    >
                      <For each={voiceOptions}>
                        {(opt) => (
                          <option value={opt.name}>
                            {opt.name === 'Custom' ? 'Custom (manual)' : `${opt.name} (${opt.tone})`}
                          </option>
                        )}
                      </For>
                    </select>
                    <Button onClick={() => removeSpeaker(index())} class="px-2 py-1 text-sm">
                      ✕
                    </Button>
                  </div>

                  <Show when={speaker.voiceName === 'Custom'}>
                    <input
                      type="text"
                      class="w-full p-2 border rounded-md dark:bg-neutral-700 dark:text-white"
                      placeholder="Enter custom voice name"
                      onInput={(e) => updateSpeaker(index(), 'voiceName', e.currentTarget.value)}
                    />
                  </Show>
                </div>
              )}
            </For>

            <Button onClick={addSpeaker} class="text-sm">
              + Add Speaker
            </Button>
          </div>

          <Button
            class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
            onClick={handleSubmit}
            disabled={loading()}
          >
            <Icon path={speakerWave} class="h-6" />
            {loading() ? 'Generating...' : 'Generate Audio'}
          </Button>

          {error() && <p class="text-red-500">{error()}</p>}

          {audioSrc() && (
            <audio controls class="w-full mt-4 rounded-lg shadow-lg">
              <source src={audioSrc()} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}
