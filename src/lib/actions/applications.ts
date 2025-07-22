'use server';
import { createSSHConnection } from '@/lib/ssh/client';
import { SSHCredentials } from '@/lib/types';

export interface ApplicationInfo {
  pid: string;
  command: string;
  appType: string;
  cpu: string;
  mem: string;
  ports: string[];
}

function detectAppType(cmd: string): string {
  if (/node/i.test(cmd)) return 'Node.js';
  if (/php.*artisan/i.test(cmd)) return 'Laravel/PHP';
  if (/java/i.test(cmd)) return 'Java';
  if (/go /i.test(cmd)) return 'Go';
  if (/python/i.test(cmd)) return 'Python';
  return 'Other';
}

export async function listUserApplications(credentials: SSHCredentials): Promise<ApplicationInfo[]> {
  const client = await createSSHConnection(credentials);
  try {
    // Get process list: PID, command, full command, CPU, MEM
    const { stdout } = await client.execCommand(
      "ps -eo pid,comm,cmd,%cpu,%mem --sort=-%cpu | grep -v 'ps -eo' | grep -v 'grep'"
    );
    const lines = stdout.split('\n').filter(Boolean).slice(1); // skip header
    const apps: ApplicationInfo[] = [];
    for (const line of lines) {
      const match = line.match(/^(\d+)\s+(\S+)\s+(.+?)\s+(\S+)\s+(\S+)$/);
      if (!match) continue;
      const [, pid, comm, cmd, cpu, mem] = match;
      const appType = detectAppType(cmd);
      if (appType === 'Other') continue; // skip system/unknown
      // Find ports used by this process
      let ports: string[] = [];
      try {
        const { stdout: lsofOut } = await client.execCommand(
          `lsof -Pan -p ${pid} -i | awk '{print $9}' | grep ':' | awk -F: '{print $2}' | sort | uniq | tr '\n' ','`
        );
        ports = lsofOut.trim().split(',').filter(Boolean);
      } catch {}
      apps.push({ pid, command: comm, appType, cpu, mem, ports });
    }
    return apps;
  } finally {
    await client.dispose();
  }
} 