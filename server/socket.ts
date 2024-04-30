import { Server } from "socket.io";
// import Memory from "./command/Memory";
import SSHClient from "./SSHClient";
import { ClientErrorExtensions } from "ssh2"; 
import Command, {  } from "./command/Command";
type DefaultEventsMap = any;
export type IOServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { client: SSHClient; cmd: Command }
>;

export function bindSocket(io: IOServer) {
  io.use((socket, next) => {
    socket.data.client = new SSHClient(socket.handshake.auth as any);
    socket.data.client
      .connect()
      .then(() => {
        next();
      })
      .catch((e: Error & ClientErrorExtensions) => {
        next(e);
      });
  });

  io.on("connection", (socket) => {
    
    socket.data.cmd = new Command(socket.data.client, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      socket.data.client.close();
    });
  });
  return io;
}

