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
  private disposeSsh(clientId: string) {
    const sshClient = this.sshClientMap.get(clientId);
    if (sshClient) {
      sshClient.end();
      this.sshClientMap.delete(clientId);
    }
    this.sshStreamMap.delete(clientId);
  }
  constructor(
    private readonly authService: AuthService,
    private readonly terminalService: TerminalService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token?.replace('Bearer ', '').trim();

    if (!token) {
      client.emit('error', 'Unauthorized: Missing or malformed token');
      client.disconnect();
      return;
    }

    const clientId = client.id;
    this.cwdMap.set(clientId, process.cwd());

    const info = {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      uptime: os.uptime(),
      hostname: os.hostname(),
      cwd: process.cwd(),
      homedir: os.homedir(),
    };

    const convertUptimeToTime = (seconds: number) => {
      const days = Math.floor(seconds / (24 * 3600));
      const hours = Math.floor((seconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      let str = '';
      if (days) str += `${days}d `;
      if (hours) str += `${hours}h `;
      if (minutes) str += `${minutes}m `;
      if (secs) str += `${secs}s`;
      return str;
    };

    const sendSystemInfo = () => {
      exec('uptime', (_, stdout) => {
        const systemLoad =
          stdout.split('load average: ')[1]?.split(',')[0] || 'n/a';
        exec('free -h', (_, memOut) => {
          const memory = memOut.split('\n')[1].split(/\s+/);
          const swap = memOut.split('\n')[2].split(/\s+/);
          const uptimeString = convertUptimeToTime(info.uptime);

          const message = `
Project Name: Smart Terminal AI

Smart Terminal AI is an intelligent, web-based terminal interface powered by NestJS and SolidJS, integrated with AI models like Amazon Q, ChatGPT, and Gemini.

* Docs:  https://github.com/evillan0315/bash-ai/docs
* Repo:  https://github.com/evillan0315/bash-ai

System info as of ${new Date().toUTCString()}:

System load: ${systemLoad}		Uptime: ${uptimeString}
Memory: ${memory[2]} / ${memory[1]}	Hostname: ${info.hostname}
Swap: ${swap[2]} / ${swap[1]}		Home: ${info.homedir}
`;
          client.emit('outputMessage', message);
        });
      });
    };

    sendSystemInfo();
    const interval = setInterval(sendSystemInfo, 5000);
    this.systemIntervalMap.set(clientId, interval);

    client.on('disconnect', () => this.handleDisconnect(client));
  }

  @SubscribeMessage('exec')
  handleCommand(
    @MessageBody() command: string,
    @ConnectedSocket() client: Socket,
  ) {
    const clientId = client.id;

    if (this.sshStreamMap.has(clientId)) {
      // SSH mode
      const stream = this.sshStreamMap.get(clientId);
      stream.write(`${command}\n`);
      return;
    }

    // Local shell fallback
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
  }

  @SubscribeMessage('close')
  handleSessionClose(@ConnectedSocket() client: Socket) {
    this.terminalService.dispose(client.id);
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
  }
}
