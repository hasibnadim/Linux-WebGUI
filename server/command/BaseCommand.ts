import SSHClient from "../SSHClient";

export default class {
  constructor(private _ssh: SSHClient) {}
  protected get ssh() {
    return this._ssh.client;
  }
  protected execSync(cmd: string): Promise<{ code: string; data: string }> {
    return new Promise((resolve, reject) => {
      this._ssh.client.exec(cmd, (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let data = "";
          stream.on("data", (chunk) => {
            data += chunk;
          });
          stream.on("close", (code: string, signal) => {
            resolve({ code, data });
          });
        }
      });
    });
  }
}
