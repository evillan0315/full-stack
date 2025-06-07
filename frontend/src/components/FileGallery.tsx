import { createResource, Show, For, createSignal, onCleanup } from 'solid-js';
import api from '../services/api';
import Loading from './Loading';

import type { ReadFileResponseDto } from '../types';

const getFileType = (filename: string): 'video' | 'audio' | 'image' | 'unknown' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'unknown';
  if (['mp4', 'webm', 'ogg', 'flv'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'webm', 'm4a'].includes(ext)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  return 'unknown';
};

export const FileGallery = () => {
  const [directory] = createSignal('/file/list?directory=./downloads&recursive=true');
  const [activeIndex, setActiveIndex] = createSignal<number | null>(null);
  let mediaRef: HTMLMediaElement | null = null;

  const [collapsedTypes, setCollapsedTypes] = createSignal<Record<string, boolean>>({
    video: false,
    audio: false,
    image: false,
    unknown: false,
  });

  const toggleCollapse = (type: string) => {
    setCollapsedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const [files] = createResource(async () => {
    const res = await api.get<ReadFileResponseDto[]>(directory());

    const result = res.data.map((file) => ({
      name: file.name,
      type: getFileType(file.name),
      lang: file.lang,
      mimeType: file.mimeType,
      path: file.path,
      url: `${import.meta.env.BASE_URL_API}/api/media/${encodeURIComponent(file.name)}`,
    }));

    const playableIndexes = result
      .map((f, i) => (f.type === 'video' || f.type === 'audio' ? i : null))
      .filter((i) => i !== null) as number[];

    if (playableIndexes.length > 0) {
      const randomIndex = playableIndexes[Math.floor(Math.random() * playableIndexes.length)];
      setActiveIndex(randomIndex);
    }

    return result;
  });

  const handleEnded = () => {
    const playableIndexes = files()
      ?.map((f, i) => (f.type === 'video' || f.type === 'audio' ? i : null))
      .filter((i) => i !== null) as number[];

    if (playableIndexes.length > 1) {
      let newIndex: number;
      do {
        newIndex = playableIndexes[Math.floor(Math.random() * playableIndexes.length)];
      } while (newIndex === activeIndex());

      setActiveIndex(newIndex);
    }
  };

  onCleanup(() => {
    if (mediaRef) {
      mediaRef.removeEventListener('ended', handleEnded);
    }
  });

  const groupedFiles = () => {
    const grouped: Record<string, typeof files extends () => infer R ? R[] : any[]> = {
      video: [],
      audio: [],
      image: [],
      unknown: [],
    };

    for (const file of files() || []) {
      grouped[file.type].push(file);
    }

    return grouped;
  };

  return (
    <div class="p-4">
      <Show when={!files.loading} fallback={<Loading />}>
        <For each={['video', 'audio', 'image', 'unknown']}>
          {(type) => (
            <div class="mb-6 flex-1 w-full">
              <button
                class="w-full text-left font-bold text-lg bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => toggleCollapse(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Files
                <span class="float-right">{collapsedTypes()[type] ? '+' : '-'}</span>
              </button>

              <Show when={!collapsedTypes()[type]}>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                  <For each={groupedFiles()[type]}>
                    {(file, index) => (
                      <div class="p-6 border rounded-lg bg-gray-800/10">
                        <p class="text-sm font-medium break-words mb-2">{file.name}</p>

                        <Show when={file.lang === 'video'}>
                          <video
                            class="w-full h-auto rounded"
                            controls
                            autoplay={index() === activeIndex()}
                            muted
                            ref={(el) => {
                              if (index() === activeIndex()) {
                                mediaRef = el;
                                el.addEventListener('ended', handleEnded);
                              }
                            }}
                          >
                            <source src={file.url} type={file.mimeType || 'video/mp4'} />
                            Your browser does not support the video tag.
                          </video>
                        </Show>

                        <Show when={file.lang === 'audio'}>
                          <audio
                            class="w-full"
                            controls
                            autoplay={index() === activeIndex()}
                            ref={(el) => {
                              if (index() === activeIndex()) {
                                mediaRef = el;
                                el.addEventListener('ended', handleEnded);
                              }
                            }}
                          >
                            <source src={file.url} type={file.mimeType || 'audio/mpeg'} />
                            Your browser does not support the audio tag.
                          </audio>
                        </Show>

                        <Show when={file.lang === 'image'}>
                          <img src={file.url} alt={file.name} class="w-full h-auto rounded" />
                        </Show>

                        <Show when={file.type === 'unknown'}>
                          <p class="text-red-500">Unsupported file type</p>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};
