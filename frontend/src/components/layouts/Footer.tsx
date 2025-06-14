import { For, Show, createSignal } from 'solid-js';
import { company } from '../../data/app';
import type { MenuItem } from './types';
import { Icon } from '@iconify-icon/solid';
import { showToast } from '../../stores/toast';
import api from '../../services/api';

interface FooterProps {
  links: MenuItem[];
}

const Footer = (props: FooterProps) => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [recordingPath, setRecordingPath] = createSignal('');

  const handleScreenRecordToggle = async () => {
    try {
      if (!isRecording()) {
        const response = await api.get(`/record/start?filename=./downloads/recorded-screen-${Date.now()}.mp4`);
        const path = response.data?.path;
        if (!path) throw new Error('Invalid start response');
        setRecordingPath(path);
        setIsRecording(true);
        showToast(`🟢 Recording started`, 'info');
      } else {
        await api.get('/record/stop');
        setIsRecording(false);
        const file = recordingPath().split('/').pop() || '';
        const url = `${import.meta.env.BASE_URL_API}/api/media/${encodeURIComponent(file)}`;
        showToast(
          `<div class="flex items-center justify-start gap-2">
            Screen recording stopped
          </div>`,
          'success',
        );
      }
    } catch (err) {
      showToast(`Error: ${(err as any).message}`, 'error');
    }
  };

  const handleScreenShot = async () => {
    try {
      const response = await api.get('/screen/capture');
      const path = response.data?.path;
      if (!path) throw new Error('Invalid screenshot response');
      const url = `${import.meta.env.BASE_URL_API}/api/media/${encodeURIComponent(path.split('/').pop())}`;
      showToast(
        `<div class="flex items-center justify-start gap-2">
          <img src="${url}" alt="screenshot" class="w-10 h-10 rounded" />
          Screen captured successfully
        </div>`,
        'success',
      );
    } catch (err) {
      showToast(`Error: ${(err as any).message}`, 'error');
    }
  };

  return (
    <footer class="sticky bottom-0 z-50 h-[2rem] flex items-center min-w-0 border-t bg-gray-500/10 border-gray-800/50 justify-between px-4">
      <div class="flex items-center justify-between">
        <p>© 2025 {company.name}. All rights reserved.</p>
        <div class="flex flex-grow">
          <button
            onClick={handleScreenShot}
            title="Take a screenshot of the current screen"
            class="flex items-center justify-center gap-2 ml-6 cursor-pointer"
          >
            <Icon icon="mdi:monitor-screenshot" width="20" height="20" />
            Screenshot
          </button>

          <button
            onClick={handleScreenRecordToggle}
            title="Screen Record"
            class="flex items-center justify-center gap-2 ml-6 cursor-pointer"
          >
            <Icon
              icon={isRecording() ? 'mdi:stop-circle' : 'mdi:record-rec'}
              width="20"
              height="20"
              class={isRecording() ? 'text-red-500' : ''}
            />{' '}
            {isRecording() ? 'Recording...' : 'Record Screen'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
