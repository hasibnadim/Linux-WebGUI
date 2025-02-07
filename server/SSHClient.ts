import { Client } from "ssh2";

type TCredentials = {
  host?: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
};
class SSHClient {
  private _pvConn = new Client();
  constructor(private _credentials: TCredentials) {
    this._pvConn.on("close", () => {
      console.log("Connection closed");
    });
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
 
      this._pvConn.connect({
        host: this._credentials.host || "localhost",
        port: this._credentials.port || 22,
        username: this._credentials.username,
        password: this._credentials.password,
        privateKey: this._credentials.privateKey,
        passphrase: this._credentials.passphrase,
      });
      this._pvConn.on("ready", () => {
        console.log("Connected");
        
        resolve();
      });
      this._pvConn.on("error", reject);
    });
  }
  public reconnect() {
    return this.connect();
  }
  public close() {
    this._pvConn.destroy();
  }
  get client() {
    return this._pvConn;
  }
  
}

export default SSHClient;
