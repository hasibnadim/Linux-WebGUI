import { Socket } from "socket.io";
import SSHClient from "../SSHClient";
import CPU from "./CPU";
import Memory from "./Memory";
import Disk from "./Disk";

class Command {
  constructor(private _client: SSHClient, private _socket: Socket) {
    new Memory(this._client, this._socket);
    new CPU(this._client, this._socket);
    new Disk(this._client, this._socket);
  }
}
export default Command;
export enum CMD {
  MEMORY = "memory",
  DISK = "disk",
  CPU = "cpu",
}
