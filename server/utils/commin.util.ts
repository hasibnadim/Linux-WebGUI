import { hostname, networkInterfaces } from "os";
import { ByteConverter, ENV } from "./type";
import { CMD } from "../command/Command";

export const e_ =(s:CMD)=> `_${s}`
export const x_ =(s:CMD)=> `x_${s}`
export const err_ =(s:CMD)=> `err_${s}`

export const printAddress = () => {
  const port = env("PORT", 3000);
  const links: string[] = [];
  let nets = networkInterfaces();

  for (const interfaceName of Object.keys(nets)) {
    for (const net of nets[interfaceName] || []) {
      if (net.family === "IPv4") {
        links.push(`\t| URL: http://${net.address}:${port} -> MAC: ${net.mac}`);
      }
    }
  }
  console.log(links.join("\n"));
  console.log(`\t| Local: http://${hostname()}:${port}`); 
};
export function getCamelCase(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

export const env: ENV = (key, defaultValue) => {
  return process.env[key] || defaultValue || "";
};

export const isProduction = (): boolean => {
  return env("NODE_ENV") !== "development";
};

export const byteConverter: ByteConverter = (bytes, isString = true) => {
  // declear var
  const units = ["B", "KB", "MB"];
  let i = 0;
  // downgrad bytes unit
  for (; i < units.length; i++) {
    if (bytes >= 1024 && units.length > i + 1) {
      bytes = bytes / 1024;
    } else break;
  }
  bytes = parseFloat(bytes.toFixed(2));
  if (isString) return `${bytes + units[i]}`;

  return {
    value: bytes,
    unit: units[i],
  };
};

export function getObjectSize(obj: Object): number {
  if (Object.keys(obj).length) return Buffer.from(JSON.stringify(obj)).length;

  return 0;
}
