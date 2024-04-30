import React from 'react'; 
import { io, Socket } from 'socket.io-client';

declare global {
    interface Window {
        io: Socket<ServerToClientEvents, ClientToServerEvents>
    }
}
interface ServerToClientEvents{
     
    pong: (s:string)=>void
    "_memory": (data:any)=>void
    "_cpu": (data:any)=>void
    "_disk": (data:any)=>void
}
interface ClientToServerEvents{
    "ping": (s:string)=>void
    "@memory": ()=>void
    "@cpu":()=>void
    "@disk":()=>void
}
type TCredentials = {
    host?: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
  };
export function connectIo(setIOBool: React.Dispatch<React.SetStateAction<boolean>>,credentials:TCredentials) {
    const socket = io({auth:credentials});
   
    window.io = socket;
    window.io.on("connect", () => {
        setIOBool(true);
       socket.on("disconnect", () => {
        setIOBool(false);
       })
    });
}