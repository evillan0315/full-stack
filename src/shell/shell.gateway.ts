import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ShellService } from './shell.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ShellGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly shellService: ShellService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('runCommand')
  handleRunCommand(
    @MessageBody()
    data: { command: string; cwd: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { command, cwd } = data;
    this.shellService.runCommand(command, cwd, client);
  }
}
