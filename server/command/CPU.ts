import Base from "./BaseCommand";
import SSHClient from "../SSHClient";
import { Socket } from "socket.io";
import { CMD } from "./Command";
import { e_ } from "../utils/commin.util";

class CPU extends Base {
  constructor(_client: SSHClient, private _socket: Socket) {
    super(_client);
    this._socket.on(CMD.CPU, () => {
      this.getCPUInfo().then((data) => {
        this._socket.emit(e_(CMD.CPU), data);
      });
    });
  }

  async getCPUInfo() {
    return new Promise<ICPU>(async (resolve, reject) => {
      try {
        let { data } = await this.execSync("lscpu");
        const lines = data.split("\n");
        const all = lines.reduce((pv: Record<string, string>, line) => {
          let [key, value] = line.split(":");
          if (key) pv[key.trim()] = value.trim();
          return pv; // Return the updated value
        }, {});
        resolve(all as any as ICPU);
      } catch (error) {
        reject(error);
      }
    });
  }
  async getCPUUsage() {
    return new Promise((resolve, reject) => {
      this.ssh.exec("mpstat", (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let data = "";
          stream.on("data", (chunk) => {
            data += chunk;
          });
          stream.on("close", (code: string, signal) => {
            resolve(data);
          });
        }
      });
    });
  }
  async getGPUInfo() {
    return new Promise((resolve, reject) => {
      this.ssh.exec("nvidia-smi", (err, stream) => {
        if (err) {
          reject(err);
        } else {
          let data = "";
          stream.on("data", (chunk) => {
            data += chunk;
          });
          stream.on("close", (code: string, signal) => {
            resolve(data);
          });
        }
      });
    });
  }
}
export default CPU;

interface ICPU {
  Architecture: string;
  "CPU op-mode(s)": string;
  "Byte Order": string;
  "CPU(s)": string;
  "On-line CPU(s) list": string;
  "Thread(s) per core": string;
  "Core(s) per socket": string;
  "Socket(s)": string;
  "NUMA node(s)": string;
  Vendor: string;
  Model: string;
  "CPU family": string;
  "Model name": string;
  Stepping: string;
  "CPU MHz": string;
  BogoMIPS: string;
  "Hypervisor vendor": string;
  "Virtualization type": string;
  "L1d cache": string;
  "L1i cache": string;
  "L2 cache": string;
  "L3 cache": string;
  "NUMA node0 CPU(s)": string;
  Flags: string;
}
