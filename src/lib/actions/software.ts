'use server';
import { createSSHConnection } from '@/lib/ssh/client';
import { SSHCredentials } from '@/lib/types';

export async function isGitInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('git --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isNvmInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('command -v nvm');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isNodeInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('node --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isPm2Installed(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('pm2 --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isPythonInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('python3 --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isDockerInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('docker --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isApacheInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('apache2 -v');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isNginxInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('nginx -v');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isMysqlInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('mysql --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
}

export async function isPostgresInstalled(credentials: SSHCredentials): Promise<string | null> {
  const client = await createSSHConnection(credentials);
  try {
    const { stdout } = await client.execCommand('psql --version');
    return stdout.trim() || null;
  } catch {
    return null;
  } finally {
    await client.dispose();
  }
} 