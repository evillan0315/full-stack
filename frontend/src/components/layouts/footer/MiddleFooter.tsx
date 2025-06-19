import { Show, createSignal, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

import { Button } from '../../../components/ui/Button';
import { showToast } from '../../../stores/toast';
import api from '../../../services/api';

interface MiddleFooterProps {
  show?: boolean;
}

export const MiddleFooter = (props: MiddleFooterProps): JSX.Element => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [recordingPath, setRecordingPath] = createSignal('');

  const handleScreenRecordToggle = async () => {
    try {
      if (!isRecording()) {
        const response = await api.get(`/screen/record-start?filename=./downloads/recorded-screen-${Date.now()}.mp4`);
        const path = response.data?.path;
        if (!path) throw new Error('Invalid start response');
        setRecordingPath(path);
        setIsRecording(true);
        showToast(`🟢 Recording started`, 'info');
      } else {
        await api.get('/screen/record-stop');
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
    <Show when={props.show}>
      <div class="flex items-center justify-start gap-2">
        <Button onClick={handleScreenShot} title="Take a screenshot of the current screen">
          <Icon icon="mdi:monitor-screenshot" width="20" height="20" />
        </Button>
        <Button onClick={handleScreenRecordToggle} title="Record your screen in real time.">
          <Icon
            icon={isRecording() ? 'mdi:stop-circle' : 'mdi:record-rec'}
            width="20"
            height="20"
            class={isRecording() ? 'text-red-500' : ''}
          />{' '}
          {isRecording() ? 'Recording...' : 'Record Screen'}
        </Button>
      </div>
    </Show>
  );
};
