import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as os from 'os';
import * as process from 'process';
import { resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { exec } from 'child_process';
import { Client as SSHClient, ConnectConfig } from 'ssh2';

import { TerminalService } from './terminal.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { LogService } from '../log/log.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'terminal',
})
export class TerminalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TerminalGateway.name);

  @WebSocketServer()
  server: Server;

  private systemIntervalMap = new Map<string, NodeJS.Timeout>();
  private cwdMap = new Map<string, string>();
  private sshClientMap = new Map<string, SSHClient>();
  private sshStreamMap = new Map<string, any>();

  constructor(
    private readonly authService: AuthService,
    private readonly terminalService: TerminalService,
    private readonly logService: LogService, // Inject LogService
  ) {}

  private disposeSsh(clientId: string) {
    const sshClient = this.sshClientMap.get(clientId);
    if (sshClient) {
      sshClient.end();
      this.sshClientMap.delete(clientId);
    }
    this.sshStreamMap.delete(clientId);
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token?.replace('Bearer ', '').trim();

    if (!token) {
      client.emit('error', 'Unauthorized: Missing or malformed token');
      client.disconnect();
      return;
    }

    const clientId = client.id;
    this.cwdMap.set(clientId, process.cwd());

    // Log WebSocket connect
    await this.logService.websocket('connect', clientId);

    client.emit('outputPath', process.cwd());
    client.emit('outputInfo', {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      uptime: os.uptime(),
      hostname: os.hostname(),
      cwd: process.cwd(),
    });

    client.on('disconnect', () => this.handleDisconnect(client));
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;

    this.terminalService.dispose(clientId);
    this.cwdMap.delete(clientId);

    const interval = this.systemIntervalMap.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.systemIntervalMap.delete(clientId);
    }

    this.disposeSsh(clientId);

    this.logger.log(`Client disconnected: ${clientId}`);

    // Log WebSocket disconnect
    this.logService.websocket('disconnect', clientId);
  }

  @SubscribeMessage('exec')
  handleCommand(
    @MessageBody() command: string,
    @ConnectedSocket() client: Socket,
  ) {
    const clientId = client.id;

    // Log WebSocket command execution
    this.logService.websocket('exec', clientId);

    if (this.sshStreamMap.has(clientId)) {
      const stream = this.sshStreamMap.get(clientId);
      stream.write(`${command}\n`);
      return;
    }

    let cwd = this.cwdMap.get(clientId) || process.cwd();

    const trimmed = command.trim();
    if (trimmed.startsWith('cd')) {
      const target = trimmed.slice(3).trim() || os.homedir();
      const newCwd = resolve(cwd, target);
      if (existsSync(newCwd) && statSync(newCwd).isDirectory()) {
        this.cwdMap.set(clientId, newCwd);
        client.emit('output', `Changed directory to ${newCwd}\n`);
      } else {
        client.emit('error', `No such directory: ${newCwd}\n`);
      }
      client.emit('prompt', { cwd: newCwd, command });
      return;
    }

    if (trimmed === 'osinfo') {
      const info = {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        uptime: os.uptime(),
        hostname: os.hostname(),
        cwd,
      };
      client.emit(
        'output',
        Object.entries(info)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n'),
      );
      return;
    }

    client.emit('prompt', { cwd, command });
    this.terminalService.runCommand(clientId, command, cwd, client);
  }

  @SubscribeMessage('ssh-connect')
  async handleSshConnect(
    @MessageBody()
    payload: {
      host: string;
      port?: number;
      username: string;
      password?: string;
      privateKey?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const sshClient = new SSHClient();
    const clientId = client.id;

    const config: ConnectConfig = {
      host: payload.host,
      port: payload.port || 22,
      username: payload.username,
      ...(payload.password ? { password: payload.password } : {}),
      ...(payload.privateKey ? { privateKey: payload.privateKey } : {}),
    };

    sshClient
      .on('ready', () => {
        this.logger.log(`SSH connected for client ${clientId}`);
        client.emit('output', `Connected to ${payload.host}\n`);

        this.logService.websocket('ssh-connect', clientId);

        sshClient.shell((err, stream) => {
          if (err) {
            client.emit('error', `Shell error: ${err.message}`);
            return;
          }

          this.sshStreamMap.set(clientId, stream);

          stream
            .on('data', (data: Buffer) => {
              client.emit('output', data.toString());
            })
            .on('close', () => {
              client.emit('output', 'SSH session closed\n');
              this.disposeSsh(clientId);
              this.logService.websocket('ssh-disconnect', clientId);
            });
        });
      })
      .on('error', (err) => {
        client.emit('error', `SSH error: ${err.message}`);
      })
      .connect(config);

    this.sshClientMap.set(clientId, sshClient);
  }

  @SubscribeMessage('input')
  handleInput(
    @MessageBody() data: { input: string },
    @ConnectedSocket() client: Socket,
  ) {
    const clientId = client.id;

    this.logService.websocket('input', clientId);

    if (this.sshStreamMap.has(clientId)) {
      const stream = this.sshStreamMap.get(clientId);
      stream.write(data.input);
      return;
    }

    this.terminalService.write(clientId, data.input);
  }

  @SubscribeMessage('resize')
  handleResize(
    @MessageBody() data: { cols: number; rows: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.terminalService.resize(client.id, data.cols, data.rows);
    this.logService.websocket('resize', client.id);
  }

  @SubscribeMessage('close')
  handleSessionClose(@ConnectedSocket() client: Socket) {
    this.terminalService.dispose(client.id);
    this.logService.websocket('close', client.id);
  }
}
