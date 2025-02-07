import React from "react";
import { io, Socket } from "socket.io-client";

declare global {
  interface Window {
    io: Socket<ServerToClientEvents, ClientToServerEvents>;
  }
}
interface ServerToClientEvents {
  pong: (s: string) => void;
  _memory: (data: any) => void;
  _cpu: (data: any) => void;
  _disk: (data: any) => void;
}
interface ClientToServerEvents {
  ping: (s: string) => void;
  "@memory": () => void;
  "@cpu": () => void;
  "@disk": () => void;
}
type TCredentials = {
  host?: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
};

interface IConnectIo {
  setIOBool: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  credentials: TCredentials;
}
export function connectIo(agrs: IConnectIo) {
  const socket = io({ auth: agrs.credentials });
  agrs.setErrorMsg("Connecting...");
  window.io = socket;
  window.io.on("connect", () => {
    agrs.setIOBool(true);
    socket.on("disconnect", () => {
      agrs.setIOBool(false);
      agrs.setErrorMsg("Disconnected");
    });
  });
  // check on connection error
  window.io.on("connect_error", (err) => {
    agrs.setIOBool(false);
    agrs.setErrorMsg(err.message || "Connection Error");
  });
}
