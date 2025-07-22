import { Client } from 'ssh2';
import { SSHCredentials } from '@/lib/types';

export class SSHClient {
  private conn: Client;

  constructor(private credentials: SSHCredentials) {
    this.conn = new Client();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.connect({
        host: this.credentials.host,
        port: this.credentials.port,
        username: this.credentials.username,
        password: this.credentials.password,
        privateKey: this.credentials.privateKey,
        passphrase: this.credentials.passphrase,
      });

      this.conn.on('ready', () => {
        resolve();
      });

      this.conn.on('error', (err) => {
        reject(err);
      });
    });
  }

  async execCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let stdout = '';
        let stderr = '';

        stream
          .on('data', (data: Buffer) => {
            stdout += data.toString();
          })
          .stderr.on('data', (data: Buffer) => {
            stderr += data.toString();
          });

        stream.on('close', () => {
          resolve({ stdout, stderr });
        });
      });
    });
  }

  dispose(): void {
    this.conn.end();
  }
}

export async function createSSHConnection(credentials: SSHCredentials) {
  const client = new SSHClient(credentials);
  await client.connect();
  return client;
}