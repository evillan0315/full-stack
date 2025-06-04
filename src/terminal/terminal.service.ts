import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as pty from 'node-pty';
import * as os from 'os';
import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';

interface TerminalSession {
  ptyProcess: pty.IPty;
}

@Injectable()
export class TerminalService {
  private readonly defaultShell =
    os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  private sessions = new Map<string, TerminalSession>();

  runCommand(sessionId: string, command: string, cwd: string, client: any) {
    const shell = pty.spawn(this.defaultShell, ['-c', command], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd,
      env: process.env,
    });

    this.sessions.set(sessionId, { ptyProcess: shell });

    shell.onData((data: string) => {
      client.emit('output', data);
    });

    shell.onExit(({ exitCode, signal }) => {
      client.emit(
        'close',
        `Process exited with code ${exitCode}, signal ${signal ?? 'none'}`,
      );
      this.sessions.delete(sessionId);
    });
  }

  write(sessionId: string, input: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.ptyProcess.write(input);
    }
  }

  resize(sessionId: string, cols: number, rows: number) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.ptyProcess.resize(cols, rows);
    }
  }

  dispose(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.ptyProcess.kill();
      this.sessions.delete(sessionId);
    }
  }

  async runCommandOnce(
    command: string,
    cwd: string,
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const shell = spawn(command, {
        shell: '/bin/bash',
        cwd,
      });

      let stdout = '';
      let stderr = '';

      shell.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      shell.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      shell.on('close', (code) => {
        resolve({
          stdout,
          stderr,
          exitCode: code ?? 0,
        });
      });

      shell.on('error', (err) => {
        reject(err);
      });
    });
  }

  async runSshCommandOnce(options: {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKeyPath?: string;
    command: string;
  }): Promise<string> {
    const {
      host,
      port = 22,
      username,
      password,
      privateKeyPath,
      command,
    } = options;

    const config: ConnectConfig = {
      host,
      port,
      username,
    };

    if (privateKeyPath) {
      config.privateKey = readFileSync(privateKeyPath);
    } else if (password) {
      config.password = password;
    } else {
      throw new Error('SSH requires either a password or private key path');
    }

    return new Promise((resolve, reject) => {
      const conn = new Client();
      let result = '';

      conn
        .on('ready', () => {
          conn.exec(command, (err, stream) => {
            if (err) return reject(err);

            stream
              .on('close', () => {
                conn.end();
                resolve(result.trim());
              })
              .on('data', (data: Buffer) => {
                result += data.toString();
              })
              .stderr.on('data', (data: Buffer) => {
                result += data.toString(); // You can separate stderr if needed
              });
          });
        })
        .on('error', (err) => {
          reject(err);
        })
        .connect(config);
    });
  }
}
