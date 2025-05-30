import { createSignal } from "solid-js";
import { Button } from "../components/ui/Button";
import { Icon } from 'solid-heroicons';
import {
  speakerWave
} from 'solid-heroicons/outline';
import Header from '../components/Header';
export default function TTSForm() {
  const [prompt, setPrompt] = createSignal("");
  const [audioSrc, setAudioSrc] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async () => {
  setLoading(true);
  setError("");
  setAudioSrc(null);

  try {
    const response = await fetch("/api/google-tts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt() }),
    });

    if (!response.ok) throw new Error("Failed to generate audio");

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    setAudioSrc(audioUrl);
  } catch (err: any) {
    setError(err.message || "Unexpected error");
  } finally {
    setLoading(false);
  }
};

  return (
  <div class="bg-white dark:bg-neutral-900 h-screen w-full">
  <Header />
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-3xl mx-auto p-6  bg-white rounded-2xl shadow-lg space-y-4 dark:bg-neutral-950 border dark:border-neutral-600">
      <h2 class="text-2xl font-bold dark:text-neutral-400">Generate TTS Audio</h2>

      <textarea
        rows={4}
        class="w-full p-3 min-h-[300px] border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-neutral-100"
        placeholder="Enter your prompt here..."
        value={prompt()}
        onInput={(e) => setPrompt(e.currentTarget.value)}
      />

      <Button class="w-full flex cursor-alias items-center gap-2 px-2 py-2 text-left text-neutral-800 dark:text-neutral-200 dark:hover:text-yellow-500 leading-0 uppercase tracking-widest" onClick={handleSubmit} disabled={loading()}>
        <Icon path={speakerWave} class="h-6" /> {loading() ? "Generating..." : "Generate Audio"}
      </Button>

      {error() && <p class="text-red-500">{error()}</p>}

      {audioSrc() && (
        <audio controls class="w-full mt-4">
          <source src={audioSrc()} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
    </div>
    </div>
  );
}

