import { onCleanup, onMount } from 'solid-js';
import { io, Socket } from 'socket.io-client';
import { uploadProgress, transcodeProgress, connectionStatus } from '../stores/socketStore';

export function useSocket(namespace: string) {
  let socket: Socket;

  onMount(() => {
    socket = io(`http://localhost:3000${namespace}`, {
      withCredentials: true,
    });

    socket.on('connect', () => connectionStatus.set('connected'));
    socket.on('disconnect', () => connectionStatus.set('disconnected'));

    switch (namespace) {
      case '/files':
        // Add your file-related event handlers here
        break;

      case '/gemini':
        // Add your gemini-related event handlers here
        break;

      case '/terminal':
        // Add your terminal-related event handlers here
        break;

      case '/logs':
        // Add your logs-related event handlers here
        socket.on('log_entry', (data) => {
          logsOutput.set([...logsOutput.get(), data.entry]);
        });
        break;

      case '/download':
        socket.on('download_progress', (data) => {
          downloadProgress.set(Number(data.percent));
        });
        socket.on('download_complete', () => {
          downloadProgress.set(100);
        });
        break;

      case '/upload':
        socket.on('upload_progress', (data) => {
          uploadProgress.set(Number(data.percent));
        });
        socket.on('upload_complete', () => {
          uploadProgress.set(100);
        });
        break;

      case '/transcode':
        socket.on('transcode_progress', (data) => {
          transcodeProgress.set(Number(data.percent));
        });
        socket.on('transcode_complete', () => {
          transcodeProgress.set(100);
        });
        break;

      default:
        console.warn(`No handler defined for namespace: ${namespace}`);
        break;
    }
  });

  onCleanup(() => {
    if (socket) {
      socket?.disconnect();
      console.log(`Disconnected from namespace: ${namespace}`);
    }
  });

  return {
    emit: (event: string, data?: any) => {
      socket?.emit(event, data);
    },
    socket: () => socket,
  };
}
