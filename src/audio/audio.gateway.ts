import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AudioService } from './audio.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class AudioGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly audioService: AudioService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('extract_audio')
  async handleExtractAudio(
    @MessageBody()
    data: {
      url: string;
      format?: string;
      provider?: string;
      cookieAccess?: boolean;
    },
  ): Promise<void> {
    const { url, format = 'webm', provider, cookieAccess } = data;
    console.log('Extracting from URL:', url);
    console.log('Requested format:', format);
    console.log('Provider:', provider);
    console.log('Cookie access:', cookieAccess);

    try {
      const allowedFormats = [
        'mp3',
        'webm',
        'm4a',
        'wav',
        'mp4',
        'flv',
      ] as const;
      type Format = (typeof allowedFormats)[number];

      const isValidFormat = (f: string): f is Format =>
        allowedFormats.includes(f as Format);

      const requestedFormat: Format = isValidFormat(format) ? format : 'webm';

      const filePath = await this.audioService.extractAudioVideoFromYoutube(
        url,
        requestedFormat,
        (progress: number) => {
          this.server.emit('download_progress', { progress });
        },
        provider,
        cookieAccess,
      );

      this.server.emit('download_complete', { filePath });
    } catch (error) {
      this.server.emit('download_error', { message: error.message });
    }
  }
}
