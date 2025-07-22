'use server'

import { createSSHConnection } from "../ssh/client";
import { ServerActionResult, SSHCredentials } from "../types";

export async function getHostDomainInfo(credentials: SSHCredentials): Promise<ServerActionResult<{ hostname: string; domain: string; ip: string }>> {
    try {
      const ssh = await createSSHConnection(credentials);
      const { stdout: hostname } = await ssh.execCommand('hostname');
      const { stdout: domain } = await ssh.execCommand('hostname -d');
      const { stdout: ip } = await ssh.execCommand("hostname -I | awk '{print $1}'");
      await ssh.dispose();
      return {
        success: true,
        data: {
          hostname: hostname.trim(),
          domain: domain.trim(),
          ip: ip.trim(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get host/domain info',
      };
    }
  }
   