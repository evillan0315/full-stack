import { createSignal, Show, For, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../contexts/AuthContext';
import { SolidApexCharts } from 'solid-apexcharts';
import { Icon } from '@iconify-icon/solid';
import { FileGallery } from '../components/FileGallery';
import { PageHeader } from '../components/ui/PageHeader';
export default function FileGalleryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  onMount(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <Show when={isAuthenticated()}>
      <div class="flex flex-col max-w-7xl mx-auto">
        <div class="flex-1 scroll-smooth px-4 py-4 space-y-4 mt-2">
          <PageHeader icon="mdi:folder">
            <b>File</b> Gallery
          </PageHeader>
          <p>
            The File Gallery provides an interactive interface to browse, preview, and play downloaded media files. It
            intelligently groups files by type—<strong>Video</strong>, <strong>Audio</strong>, <strong>Image</strong>,
            and
            <strong>Unknown</strong>—and allows you to collapse or expand each section for easier navigation.
          </p>
          {/* Main Content */}
          <div class="flex flex-col md:flex-row gap-6">
            <div class="space-y-4 md:w-3/4 rounded-lg border p-6 bg-gray-800/10 border-gray-500/30">
              <FileGallery />
            </div>

            {/* Sidebar Info */}
            <div class="w-full md:w-1/4 space-y-4 ">
              <div class="p-4 border rounded-lg bg-gray-800/10 border-gray-500/30">
                <h3 class="text-xl font-semibold">🎧 About This Tool</h3>

                <h4 class="font-medium text-gray-800 mt-4">✨ Key Features</h4>
                <ul class="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Grouped view for video, audio, image, and other file types</li>
                  <li>Collapsible sections for better organization and focus</li>
                  <li>Automatic random playback for audio and video files</li>
                  <li>Instant preview of image, audio, and video files</li>
                  <li>Fully responsive layout with clean grid-based media cards</li>
                  <li>Fallback messaging for unsupported file types</li>
                </ul>

                <h4 class="font-medium text-gray-800 mt-4">🔒 Privacy & Storage</h4>
                <p class="text-gray-600">
                  All media files are stored temporarily on the server. No authentication is required to view or
                  interact with the content, but session-based access is securely enforced.
                </p>

                <h4 class="font-medium text-gray-800 mt-4">🧰 Technology Stack</h4>
                <p class="text-gray-600">
                  Built with <strong>SolidJS</strong> and <strong>NestJS</strong>, powered by <code>yt-dlp</code> for
                  media extraction, and enhanced with <strong>WebSockets</strong> and grouped UI logic for an optimized
                  user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
