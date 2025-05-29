import { UseGuards, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { spawn } from 'child_process';
import * as os from 'os';
import * as process from 'process';
import { resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { exec } from 'child_process';
import * as cookie from 'cookie';
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

  constructor(
    private readonly authService: AuthService,
    private readonly terminalService: TerminalService,
  ) {}

  async handleConnection(client: Socket) {
    let token;
    const cookies = client.handshake?.headers?.cookie;
    if (cookies) {
      const parsedCookies = cookie.parse(cookies);
      token = parsedCookies['accessToken'];
    }
    // Ensure the client is authenticated before proceeding
    if (!cookies) {
      client.emit('error', 'Authentication required');
      client.disconnect();
      return;
    }

    // 🍑 System + Directory Info
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

    // Convert uptime from seconds to a human-readable format (e.g., 1 day, 2 hours, 3 minutes)
    const convertUptimeToTime = (seconds: number) => {
      const days = Math.floor(seconds / (24 * 3600));
      const hours = Math.floor((seconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      let uptimeString = '';
      if (days > 0) uptimeString += `${days} day${days > 1 ? 's' : ''}, `;
      if (hours > 0) uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
      if (minutes > 0)
        uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
      if (secs > 0) uptimeString += `${secs} second${secs > 1 ? 's' : ''}`;
      return uptimeString;
    };

    // Function to get system load, memory, and swap usage dynamically
    const sendSystemInfo = () => {
      exec('uptime', (err, stdout, stderr) => {
        if (err) {
          console.error('Error getting uptime:', stderr);
        } else {
          const systemLoad = stdout.split('load average: ')[1]?.split(',')[0]; // Parse system load

          exec('free -h', (err, stdout, stderr) => {
            if (err) {
              console.error('Error getting memory usage:', stderr);
            } else {
              const memoryUsage = stdout.split('\n')[1].split(/\s+/); // Memory usage
              const swapUsage = stdout.split('\n')[2].split(/\s+/); // Swap usage
              const uptimeString = convertUptimeToTime(info.uptime);

              const initMessage = `
Project Name: Smart Terminal AI

Smart Terminal AI is an intelligent, web-based terminal interface powered by NestJS and SolidJS, integrated with state-of-the-art AI models like Amazon Q, ChatGPT and Google Gemini. This smart terminal allows users to interact with system commands, code snippets, and AI assistance in real-time—blending traditional shell-like functionality with natural language processing capabilities.

* Documentation:  https://github.com/evillan0315/bash-ai/docs
* Repo:     	  https://github.com/evillan0315/bash-ai

System information as of ${new Date().toUTCString()}

System load:  ${systemLoad}							Uptime:    ${uptimeString}		      
Memory usage: ${memoryUsage[2]} of ${memoryUsage[1]} (${memoryUsage[2]} used)	Hostname:  ${info.hostname}
Swap usage:   ${swapUsage[2]} of ${swapUsage[1]} (${swapUsage[2]} used)	Homedir:   ${info.homedir}                 		 
	
`;

              // Emit system info along with dynamic load and memory
              client.emit('outputMessage', initMessage);
            }
          });
        }
      });
    };

    // Send system info initially and then every 5 seconds
    sendSystemInfo();
    const intervalId = setInterval(sendSystemInfo, 5000); // Refresh system info every 5 seconds

    // Handle disconnection
    client.on('disconnect', () => {
      console.log(`Client disconnected: ${client.id}`);
      clearInterval(intervalId); // Stop sending updates when the client disconnects
      //this.clientDirectories.delete(client.id);
    });
  }

  @SubscribeMessage('exec')
  async handleCommand(
    @MessageBody() command: string,
    @ConnectedSocket() client: Socket,
  ) {
    let token;
    const cookies = client.handshake?.headers?.cookie;
    if (cookies) {
      const parsedCookies = cookie.parse(cookies);
      token = parsedCookies['accessToken'];
    }
    if (!cookies) {
      client.emit('error', 'Authentication required');
      client.disconnect();
      return;
    }

    const clientId = client.id;
    let cwd = process.cwd();

    const user = client.data.user;

    // Handle 'cd' separately
    if (command.startsWith('cd')) {
      const targetPath = command.slice(3).trim() || process.env.HOME || cwd;
      const newPath = resolve(cwd, targetPath);

      if (existsSync(newPath) && statSync(newPath).isDirectory()) {
        cwd = newPath;
        client.emit('prompt', { cwd, command });
        client.emit('output', `Changed directory to ${newPath}\n`);
      } else {
        client.emit('prompt', { cwd, command });
        client.emit('error', `No such directory: ${newPath}\n`);
      }
      return;
    }

    const trimmedCmd = command.trim();
    client.emit('prompt', { cwd, command });

    if (trimmedCmd === 'osinfo') {
      const info = {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        uptime: os.uptime(),
        hostname: os.hostname(),
        cwd: process.cwd(),
      };

      const output = Object.entries(info)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');

      client.emit('output', output);
      return;
    }
    console.log(trimmedCmd, 'trimmedCmd');
    // ✅ Delegate command execution to TerminalService
    this.terminalService.runCommand(trimmedCmd, cwd, client);
  }
  handleDisconnect(client: Socket) {
    // Clean up conversation history when client disconnects
    //this.clientConversations.delete(client.id);
    //this.clientDirectories.delete(client.id);
  }
}
