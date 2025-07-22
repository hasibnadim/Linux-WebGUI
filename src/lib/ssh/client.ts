"use server"; 
import { SSHCredentials } from "@/lib/types";
import { NodeSSH } from "node-ssh";

class SSHClient {
  private conn: NodeSSH;

  constructor(private credentials: SSHCredentials) {
    this.conn = new NodeSSH();
    this.conn.connect({
        host: this.credentials.host,
        port: this.credentials.port,
        username: this.credentials.username,
        password: this.credentials.password,
        privateKey: this.credentials.privateKey,
        passphrase: this.credentials.passphrase,
      }); 
  }

 

  async execCommand(
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      this.conn.execCommand(command, {
        onStdout: (data) => {
          resolve({ stdout: data.toString(), stderr: "" });
        },
        onStderr: (data) => {
          resolve({ stdout: "", stderr: data.toString() });
        },
      });
    });
  }

  async requestSFTP(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.requestSFTP().then((sftp) => {
        resolve(sftp);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async dispose() {
    await this.conn.dispose();
  }
}

export async function createSSHConnection(credentials: SSHCredentials) {
  const client = new SSHClient(credentials); 
  return client;
}
