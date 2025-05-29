import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class TerminalService {
  runCommand(command: string, cwd: string, client: any) {
    const shell = spawn(command, {
      shell: '/bin/bash',
      cwd,
    });

    shell.stdout.on('data', (data) => {
      client.emit('output', data.toString());
    });

    shell.stderr.on('data', (data) => {
      client.emit('error', data.toString());
    });

    shell.on('close', (code) => {
      client.emit('close', `Process exited with code ${code}`);
    });
  }

  async runCommandOnce(
    command: string,
    cwd: string,
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const { spawn } = await import('child_process');

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
}
