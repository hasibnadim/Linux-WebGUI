import Base from "./BaseCommand";
import SSHClient from "../SSHClient";
import { Socket } from "socket.io";
import { CMD } from "./Command";
import { e_ } from "../utils/commin.util";

class Disk extends Base {
  constructor(_client: SSHClient, private _socket: Socket) {
    super(_client);
    this._socket.on(CMD.DISK, () => {
      this.getDiskUsage().then((data) => {
        this._socket.emit(e_(CMD.DISK), data);
      });
    });
  }
  async getDiskUsage() {
    return new Promise<IDisk[]>(async (resolve, reject) => {
      try {
        let { data } = await this.execSync("df -h");
        const lines = data.split("\n");
        const disks = lines
          .map((line) => {
            const [fileSystem, size, used, available, use, mountedOn] =
              line.split(/\s+/);
            return { fileSystem, size, used, available, use, mountedOn };
          })
          .filter((disk) => !["Filesystem"].includes(disk.fileSystem));
        resolve(disks);
      } catch (error) {
        reject(error);
      }
    });
  }
}

interface IDisk {
  fileSystem: string;
  size: string;
  used: string;
  available: string;
  use: string;
  mountedOn: string;
}

export default Disk;
