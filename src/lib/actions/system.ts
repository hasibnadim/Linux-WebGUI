'use server'

import { createSSHConnection } from '@/lib/ssh/client';
import { SSHCredentials, ServerActionResult, MemoryInfo, CPUInfo, DiskInfo } from '@/lib/types';
import { parseMemoryOutput, parseCPUOutput, parseDiskOutput } from '@/lib/utils';

export async function testSSHConnection(credentials: SSHCredentials): Promise<ServerActionResult<boolean>> {
  try {
    const ssh = await createSSHConnection(credentials);
    ssh.dispose();
    return { success: true, data: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

export async function getMemoryInfo(credentials: SSHCredentials): Promise<ServerActionResult<MemoryInfo>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand('free -m');
    
    const memoryData = parseMemoryOutput(stdout);
    
    // Get additional physical memory info
    const { stdout: meminfoOutput } = await ssh.execCommand('cat /proc/meminfo');
    const lines = meminfoOutput.split('\n');
    const physical: Record<string, string> = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        physical[key.trim()] = value.trim();
      }
    });
    
    ssh.dispose();
    
    return { 
      success: true, 
      data: { ...memoryData, physical } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get memory info' 
    };
  }
}

export async function getCPUInfo(credentials: SSHCredentials): Promise<ServerActionResult<CPUInfo>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand('lscpu');
    
    const cpuData = parseCPUOutput(stdout) as unknown as CPUInfo;
    ssh.dispose();
    
    return { success: true, data: cpuData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get CPU info' 
    };
  }
}

export async function getDiskInfo(credentials: SSHCredentials): Promise<ServerActionResult<DiskInfo[]>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand('df -h');
    
    const diskData = parseDiskOutput(stdout);
    ssh.dispose();
    
    return { success: true, data: diskData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get disk info' 
    };
  }
}

export async function executeCommand(
  credentials: SSHCredentials, 
  command: string
): Promise<ServerActionResult<{ stdout: string; stderr: string }>> {
  try {
    // Basic command validation for security
    const dangerousCommands = ['rm', 'rmdir', 'mv', 'cp', 'dd', 'mkfs', 'fdisk'];
    const isDangerous = dangerousCommands.some(cmd => command.trim().startsWith(cmd));
    
    if (isDangerous) {
      return { 
        success: false, 
        error: 'Dangerous command not allowed' 
      };
    }

    const ssh = await createSSHConnection(credentials);
    const result = await ssh.execCommand(command);
    ssh.dispose();
    
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Command execution failed' 
    };
  }
}