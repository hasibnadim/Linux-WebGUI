
import { NodeSSH } from "node-ssh";
import { SSHCredentials } from "../types";

async function execCommand(
    conn: NodeSSH,
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      conn.execCommand(command, {
        onStdout: (data) => {
          resolve({ stdout: data.toString(), stderr: "" });
        },
        onStderr: (data) => {
          resolve({ stdout: "", stderr: data.toString() });
        },
      });
    });
  }
  async function sftpClient(conn: NodeSSH): Promise<any> {
    return new Promise((resolve, reject) => {
      conn.requestSFTP().then((sftp) => {
        resolve(sftp);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  export async function sshClient(credentials: SSHCredentials): Promise<{
    execCommand: (command: string) => Promise<{ stdout: string; stderr: string }>;
    requestSFTP: () => Promise<any>;
    dispose: () => Promise<void>;
  }> {
    const conn = new NodeSSH();
    await conn.connect({
      host: credentials.host,
      port: credentials.port,
      username: credentials.username,
      password: credentials.password,
      // privateKey: credentials.privateKey,
      // passphrase: credentials.passphrase,
    });
  
    return {
      execCommand: (command: string) => execCommand(conn, command),
      requestSFTP: () => sftpClient(conn),
      dispose: async () => {
        await conn.dispose();
      },
    };
  }
  