import AudioDownloader from '../components/AudioDownloader';
import { Icon } from '@iconify-icon/solid';
import { FileGallery } from '../components/FileGallery';
import { PageHeader } from '../components/ui/PageHeader';

export default function Downloader() {
  return (
    <div class="flex flex-col max-w-7xl mx-auto">
      <div class="flex-1 scroll-smooth px-4 py-4 space-y-4 mt-2">
        <PageHeader icon="mdi:multimedia">
          <b>Download & Extract</b> Audio or Video
        </PageHeader>
        <p>
              This downloader lets you extract audio or download full video content from platforms like{' '}
              <strong>YouTube</strong>, <strong>Bilibili</strong>, <strong>Vimeo</strong>, and many others. Powered by{' '}
              <code>yt-dlp</code>, it supports a wide range of media sources and formats.
            </p>
        {/* Main Content */}
        <div class="flex flex-col md:flex-row gap-6">
          <div class="space-y-4 md:w-3/4 rounded-lg border p-6 bg-gray-800/10 border-gray-500/30">
            <AudioDownloader />
          </div>

          {/* Sidebar Info */}
          <div class="w-full md:w-1/4 space-y-4 p-4 border rounded-lg bg-gray-800/10 border-gray-500/30">
            <h3 class="text-xl font-semibold">🎧 About This Tool</h3>
            

            <h4 class="font-medium text-gray-800 mt-4">✨ Key Features</h4>
            <ul class="list-disc pl-5 text-gray-700 space-y-1">
              <li>Extract high-quality audio or download full video content</li>
              <li>Supports YouTube, Bilibili, Vimeo, and many more providers</li>
              <li>Real-time progress updates via WebSockets</li>
              <li>Output in MP3, MP4, or other supported formats</li>
              <li>Cancelable download operations</li>
              <li>One-click access to completed files</li>
            </ul>

            <h4 class="font-medium text-gray-800 mt-4">🔒 Privacy & Storage</h4>
            <p class="text-gray-600">
              All downloads are handled server-side and stored temporarily. No login or personal data is required.
            </p>

            <h4 class="font-medium text-gray-800 mt-4">🧰 Technology Stack</h4>
            <p class="text-gray-600">
              Built with <strong>SolidJS</strong> and <strong>NestJS</strong>, powered by <code>yt-dlp</code>, and
              enhanced with <strong>WebSockets</strong> for instant feedback and interactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
