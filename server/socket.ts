import { Server } from "socket.io";
type DefaultEventsMap =any
type IOServer =  Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export function bindSocket(io:IOServer){
    io.on("connection", (socket) => { 
        socket.on("ping", (data) => {
            console.log(data);
            
            socket.emit("pong", data);
        })
    
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        })
    })
    return io;
}