export interface SSHCredentials {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
}

export interface MemoryInfo {
  unit: string;
  total: number;
  used: number;
  free: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
  shared: number;
  buffers: number;
  cached: number;
  physical: Record<string, string>;
}

export interface CPUInfo {
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

export interface DiskInfo {
  fileSystem: string;
  size: string;
  used: string;
  available: string;
  use: string;
  mountedOn: string;
}

export interface ServerActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NavItem {
  path: string;
  name: string;
  icon: React.ElementType;
}
export interface IDashboardOverview {
  cpu: { usage: string; cores: string };
  memory: { usage: string; total: string; free: string };
  disk: { usage: string; total: string; free: string };
  network: { status: string; ip: string };
  software: { packageCount: number; keySoftware: string[] };
  security: { firewall: string; openPorts: string[] };
}