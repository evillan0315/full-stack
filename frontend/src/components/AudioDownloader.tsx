import { createSignal, onCleanup, onMount } from 'solid-js';
import io from 'socket.io-client';
import { Icon } from '@iconify-icon/solid';
import { Button } from './ui/Button';

const socket = io(`${import.meta.env.BASE_URL_API}`);

export default function AudioDownloader() {
  const [url, setUrl] = createSignal('');
  const [format, setFormat] = createSignal('mp3');
  const [provider, setProvider] = createSignal('youtube');
  const [cookieAccess, setCookieAccess] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const [loading, setIsLoading] = createSignal(false);
  const [filePath, setFilePath] = createSignal('');
  const [error, setError] = createSignal('');

  const handleSubmit = () => {
    setIsLoading(true);
    setProgress(0);
    setFilePath('');
    setError('');

    socket.emit('extract_audio', {
      url: url(),
      format: format(),
      provider: provider(),
      cookieAccess: cookieAccess(),
    });
  };

  onMount(() => {
    socket.on('download_progress', (data) => {
      setProgress(data.progress);
      if (data.progress >= 100) {
        setIsLoading(false);
      }
    });

    socket.on('download_complete', (data) => {
      setFilePath(data.filePath);
    });

    socket.on('download_error', (data) => {
      setError(data.message);
      setIsLoading(false);
    });

    onCleanup(() => {
      socket.off('download_progress');
      socket.off('download_complete');
      socket.off('download_error');
    });
  });

  return (
    <div class="p-4">
      <input
        type="text"
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        placeholder="Enter URL (youtube, bilibili...)"
        value={url()}
        onInput={(e) => setUrl(e.currentTarget.value)}
      />

      <select
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        value={format()}
        onChange={(e) => setFormat(e.currentTarget.value)}
      >
        <option value="mp3">MP3 (Audio)</option>
        <option value="wav">WAV (Audio)</option>
        <option value="m4a">M4A (Audio)</option>
        <option value="webm">WebM (Video)</option>
        <option value="mp4">MP4 (Video)</option>
        <option value="flv">FLV (Video)</option>
      </select>

      <label class="flex items-center mb-4 gap-2">
        <input type="checkbox" checked={cookieAccess()} onChange={(e) => setCookieAccess(e.currentTarget.checked)} />
        <span class="text-sm">Use cookies for provider access</span>
      </label>

      <select
        class="w-full px-4 py-2 border border-gray-500/30 rounded-md mb-4"
        value={provider()}
        onChange={(e) => setProvider(e.currentTarget.value.toLowerCase())}
      >
        <option value="youtube">YouTube</option>
        <option value="bilibili">Bilibili</option>
        {/* Add more providers as needed */}
      </select>

      <Button
        class="w-full flex items-center gap-2 px-2 py-2 uppercase tracking-widest"
        variant="secondary"
        onClick={handleSubmit}
        disabled={loading()}
      >
        <Icon icon="mdi:download" width="2.2em" height="2.2em" />
        {loading() ? 'Downloading...' : 'Download'}
      </Button>

      {progress() > 0 && (
        <div class="mt-4">
          <p>Progress: {progress().toFixed(2)}%</p>
          <div class="h-2 bg-gray-300 rounded overflow-hidden">
            <div class="h-full bg-blue-500" style={{ width: `${progress()}%` }} />
          </div>
        </div>
      )}

      {filePath() && (
        <div class="mt-4 text-green-600">
          ✅ Download complete: <code>{filePath()}</code>
        </div>
      )}

      {error() && <div class="mt-4 text-red-600">❌ Error: {error()}</div>}
    </div>
  );
}
