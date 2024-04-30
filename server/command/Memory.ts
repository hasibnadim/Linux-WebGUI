import Base from "./BaseCommand";
import SSHClient from "../SSHClient";
import { Socket } from "socket.io";
import { CMD } from "./Command";
import { e_ } from "../utils/commin.util";

class Memory extends Base {
  constructor(_client: SSHClient, private _socket: Socket) {
    super(_client);
    this._socket.on(CMD.MEMORY, () => {
      this.getMemoryInfo().then((data) => {
        this._socket.emit(e_(CMD.MEMORY), data);
      });
    });
  }
  async getMemoryInfo() {
    return new Promise<IMemeory>(async (resolve, reject) => {
      try {
        let { data } = await this.execSync("free -m");
        let physical = await this.getPhysicalMemory();
        const lines = data.split("\n");
        const [_, total, used, free, shared, buffers, cached] =
          lines[1].split(/\s+/);
        const [__, swapTotal, swapUsed, swapFree] = lines[2].split(/\s+/);
        resolve({
          unit: "MB",
          total: parseInt(total),
          used: parseInt(used),
          free: parseInt(free),
          shared: parseInt(shared),
          buffers: parseInt(buffers),
          cached: parseInt(cached),
          swapTotal: parseInt(swapTotal),
          swapUsed: parseInt(swapUsed),
          swapFree: parseInt(swapFree),
          physical,
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  async getPhysicalMemory() {
    return new Promise<Record<string, string>>(async (resolve, reject) => {
      try {
        let { data } = await this.execSync("cat /proc/meminfo");
        const lines = data.split("\n");
        let all = lines.reduce((pv: Record<string, string>, line) => {
          let [key, value] = line.split(":");
          if (key) pv[key.trim()] = value.trim();
          return pv; // Return the updated value
        }, {});
        resolve(all);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getProcessList() {
    return new Promise((resolve, reject) => {
      this.ssh.exec("ps -aux", (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let data = "";
          stream.on("data", (chunk) => {
            data += chunk;
          });
          stream.on("close", (code, signal) => {
            if (code === 0) {
              const lines = data.split("\n");
              const processes = lines.map((line) => {
                const [
                  user,
                  pid,
                  cpu,
                  mem,
                  vsz,
                  rss,
                  tty,
                  stat,
                  start,
                  time,
                  command,
                ] = line.split(/\s+/);
                return {
                  user,
                  pid,
                  cpu,
                  mem,
                  vsz,
                  rss,
                  tty,
                  stat,
                  start,
                  time,
                  command,
                };
              });
              resolve(processes);
            } else {
              reject("error");
            }
          });
        }
      });
    });
  }
}

interface IMemeory {
  unit: string;
  total: number;
  used: number;
  free: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
  shared: number;
  buffers: number;
  cached: number;
  physical: Record<string, string>;
}
export default Memory;
