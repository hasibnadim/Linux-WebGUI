require("dotenv").config();
import { Application } from "express";
import { env, isProduction, printAddress } from "./utils/commin.util";
import morgan from "morgan";
import { createServer } from "http";
import { Server as IOServer } from "socket.io"; 
import { bindSocket } from "./socket";
import path from "path";
const express = require("express");
const app: Application = express();
const httpServer = createServer(app);

const io = new IOServer(httpServer);
bindSocket(io);
    
app.use(express.static(path.join(__dirname,"..","client")),morgan("dev"));
app.get("/*", express.static(path.join(__dirname,"..","client/index.html")));

app.use(express.json({ limit: "1024kb" }));

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

httpServer.listen(env("PORT", 3000), () => {
  console.log("\x1b[34m", `\tServer started.`, "\x1b[0m");
  printAddress();
  if(!isProduction()){
    console.log("\x1b[33m", `\tServer running in ${env("NODE_ENV", "development")} mode.`, "\x1b[0m");
    console.log("To run react-vite server run -> pnpm dev:client");
  }
});
