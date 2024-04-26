 import {io,Socket } from 'socket.io-client';

declare global {
    interface Window {
        io: Socket<ServerToClientEvents, ClientToServerEvents>
    }
}
interface ServerToClientEvents{
    pong: (s:string)=>void
}
interface ClientToServerEvents{
    "ping": (s:string)=>void
}

export function connectIo(){
    window.io = io();
    window.io.on("connect", () => {
        console.log("Connected to server");
    });
}