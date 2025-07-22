'use server'

import { createSSHConnection } from '@/lib/ssh/client';
import { SSHCredentials, ServerActionResult, MemoryInfo, CPUInfo, DiskInfo, IDashboardOverview } from '@/lib/types';
import { parseMemoryOutput, parseCPUOutput, parseDiskOutput } from '@/lib/utils';

export async function testSSHConnection(credentials: SSHCredentials): Promise<ServerActionResult<boolean>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.dispose();
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
    
    await ssh.dispose();
    
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
    await ssh.dispose();
    
    return { success: true, data: cpuData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get CPU info' 
    };
  }
}

export async function getDiskInfo(credentials: SSHCredentials): Promise<ServerActionResult<{ primary: DiskInfo[], others: DiskInfo[] }>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand('df -h');

    const diskData = parseDiskOutput(stdout);
    await ssh.dispose();

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
    await ssh.dispose();
    
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Command execution failed' 
    };
  }
}

export async function getPackagesInfo(credentials: SSHCredentials): Promise<ServerActionResult<{ name: string; version: string }[]>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Try dpkg -l (Debian/Ubuntu)
    let { stdout, stderr } = await ssh.execCommand('dpkg -l');
    let packages: { name: string; version: string }[] = [];
    if (stdout && !stdout.includes('command not found')) {
      // Parse dpkg -l output
      const lines = stdout.split('\n').slice(5); // skip header lines
      packages = lines
        .map(line => line.trim().split(/\s+/))
        .filter(parts => parts.length >= 5 && parts[0] === 'ii')
        .map(parts => ({ name: parts[1], version: parts[2] }));
    } else {
      // Try rpm -qa (RHEL/CentOS/Fedora)
      ({ stdout, stderr } = await ssh.execCommand('rpm -qa --qf "%{NAME} %{VERSION}-%{RELEASE}\n"'));
      if (stdout && !stdout.includes('command not found')) {
        packages = stdout.split('\n')
          .map(line => line.trim().split(' '))
          .filter(parts => parts.length >= 2)
          .map(parts => ({ name: parts[0], version: parts[1] }));
      }
    }
    await ssh.dispose();
    return { success: true, data: packages };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get packages info'
    };
  }
}

export async function installPackage(credentials: SSHCredentials, packageName: string): Promise<ServerActionResult<string>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Try apt-get first
    let { stdout, stderr } = await ssh.execCommand(`sudo apt-get update && sudo apt-get install -y ${packageName}`);
    if (stdout && !stdout.includes('command not found')) {
      await ssh.dispose();
      return { success: true, data: stdout };
    } else {
      // Try yum
      ({ stdout, stderr } = await ssh.execCommand(`sudo yum install -y ${packageName}`));
      await ssh.dispose();
      if (stdout && !stdout.includes('command not found')) {
        return { success: true, data: stdout };
      }
    }
    return { success: false, error: stderr || 'Failed to install package' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to install package'
    };
  }
}

export async function searchAvailablePackage(credentials: SSHCredentials, packageName: string): Promise<ServerActionResult<boolean>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Try apt-cache search first
    let { stdout, stderr } = await ssh.execCommand(`apt-cache search ^${packageName}$`);
    if (stdout && !stdout.includes('command not found')) {
      await ssh.dispose();
      return { success: true, data: stdout.trim().length > 0 };
    } else {
      // Try yum search
      ({ stdout, stderr } = await ssh.execCommand(`yum search ${packageName}`));
      await ssh.dispose();
      if (stdout && !stdout.includes('command not found')) {
        // If the package name appears in the output, it's available
        return { success: true, data: stdout.includes(packageName) };
      }
    }
    return { success: false, error: stderr || 'Failed to search for package' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search for package'
    };
  }
}

export async function searchSimilarPackages(credentials: SSHCredentials, searchTerm: string): Promise<ServerActionResult<string[]>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Try apt-cache search first
    let { stdout, stderr } = await ssh.execCommand(`apt-cache search ${searchTerm}`);
    let matches: string[] = [];
    if (stdout && !stdout.includes('command not found')) {
      // Each line: 'packagename - description'
      matches = stdout.split('\n')
        .map(line => line.split(' - ')[0].trim())
        .filter(name => name.length > 0)
        .slice(0, 5);
    } else {
      // Try yum search
      ({ stdout, stderr } = await ssh.execCommand(`yum search ${searchTerm}`));
      if (stdout && !stdout.includes('command not found')) {
        // Each match line: 'packagename.arch : description'
        matches = stdout.split('\n')
          .filter(line => line.includes(' : '))
          .map(line => line.split(' : ')[0].split('.')[0].trim())
          .filter(name => name.length > 0)
          .slice(0, 5);
      }
    }
    await ssh.dispose();
    return { success: true, data: matches };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search for similar packages'
    };
  }
}

export async function getDashboardOverview(credentials: SSHCredentials): Promise<ServerActionResult<IDashboardOverview>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // CPU
    const cpuOut = await ssh.execCommand('lscpu && top -bn1 | grep "Cpu(s)"');
    let cpuUsage = '--', cpuCores = '--';
    if (cpuOut.stdout) {
      const matchCores = cpuOut.stdout.match(/CPU\(s\):\s+(\d+)/);
      cpuCores = matchCores ? matchCores[1] : '--';
      const matchUsage = cpuOut.stdout.match(/Cpu\(s\):\s+([\d\.]+)\s+us/);
      cpuUsage = matchUsage ? matchUsage[1] + '%' : '--%';
    }
    // Memory
    const memOut = await ssh.execCommand('free -m');
    let memUsage = '--', memTotal = '--', memFree = '--';
    if (memOut.stdout) {
      const lines = memOut.stdout.split('\n');
      const memLine = lines.find(l => l.toLowerCase().startsWith('mem:'));
      if (memLine) {
        const parts = memLine.split(/\s+/);
        memTotal = parts[1] + ' MB';
        memFree = parts[3] + ' MB';
        memUsage = (parseInt(parts[2]) || 0) + ' MB';
      }
    }
    // Disk
    const diskOut = await ssh.execCommand('df -h --total | grep total');
    let diskUsage = '--', diskTotal = '--', diskFree = '--';
    if (diskOut.stdout) {
      const parts = diskOut.stdout.trim().split(/\s+/);
      if (parts.length >= 5) {
        diskTotal = parts[1];
        diskUsage = parts[2];
        diskFree = parts[3];
      }
    }
    // Network
    const ipOut = await ssh.execCommand("hostname -I | awk '{print $1}'");
    let ip = '--';
    if (ipOut.stdout) ip = ipOut.stdout.trim().split(/\s+/)[0];
    const netStatus = ip !== '--' ? 'Online' : 'Offline';
    // Software
    const pkgOut = await ssh.execCommand('dpkg -l | grep ^ii | wc -l');
    let packageCount = 0;
    if (pkgOut.stdout) packageCount = parseInt(pkgOut.stdout.trim()) || 0;
    // Key software check (example: docker, python3, nodejs, nginx, mysql)
    const keyPkgs = ['docker', 'python3', 'nodejs', 'nginx', 'mysql-server', 'postgresql'];
    const keySoftware: string[] = [];
    for (const pkg of keyPkgs) {
      const check = await ssh.execCommand(`dpkg -l | grep ^ii | grep -w ${pkg}`);
      if (check.stdout && check.stdout.includes(pkg)) keySoftware.push(pkg);
    }
    // Security
    const fwOut = await ssh.execCommand('sudo ufw status');
    let firewall = '--';
    if (fwOut.stdout) firewall = fwOut.stdout.includes('active') ? 'Active' : 'Inactive';
    const portOut = await ssh.execCommand("ss -tuln | awk '{print $5}' | grep ':' | awk -F: '{print $NF}' | sort | uniq | grep -E '^[0-9]+$' | tr '\n' ','");
    let openPorts: string[] = [];
    if (portOut.stdout) openPorts = portOut.stdout.split(',').filter(Boolean);
    await ssh.dispose();
    return {
      success: true,
      data: {
        cpu: { usage: cpuUsage, cores: cpuCores },
        memory: { usage: memUsage, total: memTotal, free: memFree },
        disk: { usage: diskUsage, total: diskTotal, free: diskFree },
        network: { status: netStatus, ip },
        software: { packageCount, keySoftware },
        security: { firewall, openPorts },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get dashboard overview',
    };
  }
}

export async function getNetworkInfo(credentials: SSHCredentials): Promise<ServerActionResult<{
  interfaces: { name: string; ip: string; rx: string; tx: string }[];
  connections: { proto: string; local: string; remote: string; state: string }[];
}>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Get interface info
    const ifconfigOut = await ssh.execCommand("ip -o -4 addr show | awk '{print $2, $4}'");
    const rxTxOut = await ssh.execCommand("cat /proc/net/dev");
    let interfaces: { name: string; ip: string; rx: string; tx: string }[] = [];
    if (ifconfigOut.stdout && rxTxOut.stdout) {
      const ipLines = ifconfigOut.stdout.trim().split('\n');
      const rxTxLines = rxTxOut.stdout.trim().split('\n').slice(2);
      for (const line of ipLines) {
        const [name, ip] = line.split(' ');
        const rxTxLine = rxTxLines.find(l => l.trim().startsWith(name + ':'));
        let rx = '--', tx = '--';
        if (rxTxLine) {
          const parts = rxTxLine.replace(':', ' ').trim().split(/\s+/);
          rx = parts[1];
          tx = parts[9];
        }
        interfaces.push({ name, ip, rx, tx });
      }
    }
    // Get active connections
    const connOut = await ssh.execCommand("ss -tunap | tail -n +2");
    let connections: { proto: string; local: string; remote: string; state: string }[] = [];
    if (connOut.stdout) {
      const lines = connOut.stdout.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 6) {
          connections.push({
            proto: parts[0],
            local: parts[4],
            remote: parts[5],
            state: parts[1],
          });
        }
      }
    }
    await ssh.dispose();
    return { success: true, data: { interfaces, connections } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get network info',
    };
  }
}

export async function getSSLInfo(credentials: SSHCredentials): Promise<ServerActionResult<{
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  san: string[];
}>> {
  try {
    const ssh = await createSSHConnection(credentials);
    // Try to find a cert (default snakeoil, or search common locations)
    let certPath = '/etc/ssl/certs/ssl-cert-snakeoil.pem';
    let certOut = await ssh.execCommand(`sudo openssl x509 -in ${certPath} -noout -text`);
    if (certOut.stderr && certOut.stderr.includes('No such file')) {
      // Try another common path
      certPath = '/etc/ssl/certs/ssl-cert.pem';
      certOut = await ssh.execCommand(`sudo openssl x509 -in ${certPath} -noout -text`);
    }
    if (certOut.stderr && certOut.stderr.includes('No such file')) {
      await ssh.dispose();
      return { success: false, error: 'No SSL certificate found in common locations.' };
    }
    const text = certOut.stdout || '';
    const subject = (text.match(/Subject: (.*)/) || [])[1] || '--';
    const issuer = (text.match(/Issuer: (.*)/) || [])[1] || '--';
    const validFrom = (text.match(/Not Before: (.*)/) || [])[1] || '--';
    const validTo = (text.match(/Not After : (.*)/) || [])[1] || '--';
    const sanMatch = text.match(/X509v3 Subject Alternative Name:\s*(.*)/);
    let san: string[] = [];
    if (sanMatch && sanMatch[1]) {
      san = sanMatch[1].split(',').map(s => s.trim());
    }
    await ssh.dispose();
    return { success: true, data: { subject, issuer, validFrom, validTo, san } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get SSL info',
    };
  }
}

