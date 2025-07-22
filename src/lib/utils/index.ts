import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseMemoryOutput(output: string) {
  const lines = output.split("\n");
  const [_, total, used, free, shared, buffers, cached] = lines[1].split(/\s+/);
  const [__, swapTotal, swapUsed, swapFree] = lines[2].split(/\s+/);
  
  return {
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
    physical: {}
  };
}

export function parseCPUOutput(output: string) {
  const lines = output.split("\n");
  const result: Record<string, string> = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(":");
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });
  
  return result;
}

export function parseDiskOutput(output: string) {
  const lines = output.split("\n");
  return lines
    .slice(1) // Skip header
    .filter(line => line.trim())
    .map(line => {
      const [fileSystem, size, used, available, use, mountedOn] = line.split(/\s+/);
      return { fileSystem, size, used, available, use, mountedOn };
    });
}