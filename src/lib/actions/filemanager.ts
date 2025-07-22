'use server'
import { createSSHConnection } from '@/lib/ssh/client';
import { SSHCredentials, ServerActionResult } from '@/lib/types';
import { Buffer } from 'buffer';

export async function listDirectory(credentials: SSHCredentials, path: string): Promise<ServerActionResult<{
  files: { name: string; isDir: boolean; size: number; mtime: string }[];
}>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand(`ls -l --time-style=long-iso '${path.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    if (!stdout) return { success: false, error: 'No output from ls' };
    const lines = stdout.split('\n').slice(1).filter(Boolean);
    const files = lines.map(line => {
      // -rw-r--r-- 1 user group 1234 2023-01-01 12:00 filename
      const parts = line.split(/\s+/);
      const isDir = parts[0][0] === 'd';
      const size = parseInt(parts[4], 10);
      const mtime = parts[5] + ' ' + parts[6];
      const name = parts.slice(7).join(' ');
      return { name, isDir, size, mtime };
    });
    return { success: true, data: { files } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to list directory' };
  }
}

export async function readFile(credentials: SSHCredentials, path: string): Promise<ServerActionResult<{ content: string }>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const { stdout } = await ssh.execCommand(`cat '${path.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: { content: stdout || '' } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to read file' };
  }
}

export async function writeFile(credentials: SSHCredentials, path: string, content: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const base64 = Buffer.from(content, 'utf-8').toString('base64');
    await ssh.execCommand(`echo '${base64}' | base64 -d > '${path.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to write file' };
  }
}

export async function deleteFile(credentials: SSHCredentials, paths: string[]): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const safePaths = paths.map(p => `'${p.replace(/'/g, "'\\''")}'`).join(' ');
    await ssh.execCommand(`rm -rf ${safePaths}`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete file(s)' };
  }
}

export async function renameFile(credentials: SSHCredentials, oldPath: string, newPath: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`mv '${oldPath.replace(/'/g, "'\\''")}' '${newPath.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to rename file' };
  }
}

export async function createDirectory(credentials: SSHCredentials, path: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`mkdir -p '${path.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create directory' };
  }
}

export async function createFile(credentials: SSHCredentials, path: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`touch '${path.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create file' };
  }
}

export async function moveFile(credentials: SSHCredentials, src: string, dest: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`mv '${src.replace(/'/g, "'\\''")}' '${dest.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to move file' };
  }
}

export async function copyFile(credentials: SSHCredentials, src: string, dest: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`cp -r '${src.replace(/'/g, "'\\''")}' '${dest.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to copy file' };
  }
}

export async function compressFiles(credentials: SSHCredentials, paths: string[], destArchive: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const safePaths = paths.map(p => `'${p.replace(/'/g, "'\\''")}'`).join(' ');
    await ssh.execCommand(`tar -czf '${destArchive.replace(/'/g, "'\\''")}' ${safePaths}`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to compress files' };
  }
}

export async function extractFile(credentials: SSHCredentials, archivePath: string, destDir: string): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    await ssh.execCommand(`tar -xzf '${archivePath.replace(/'/g, "'\\''")}' -C '${destDir.replace(/'/g, "'\\''")}'`);
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to extract archive' };
  }
}

export async function uploadFile(
  credentials: SSHCredentials,
  targetPath: string,
  fileName: string,
  fileContentBase64: string
): Promise<ServerActionResult<null>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const sftp = await ssh.requestSFTP();
    const fileContent = Buffer.from(fileContentBase64, 'base64');
    await new Promise((resolve, reject) => {
      sftp.writeFile(
        `${targetPath.replace(/\/$/, '')}/${fileName}`,
        fileContent,
        (err: any) => {
          if (err) reject(err);
          else resolve(null);
        }
      );
    });
    await ssh.dispose();
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' };
  }
}

export async function downloadFile(credentials: SSHCredentials, path: string): Promise<ServerActionResult<{ name: string; content: string }>> {
  try {
    const ssh = await createSSHConnection(credentials);
    const sftp = await ssh.requestSFTP();
    const fileName = path.split('/').pop() || 'download';
    const fileContent = await new Promise<Buffer>((resolve, reject) => {
      sftp.readFile(path, (err: any, data: Buffer) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    await ssh.dispose();
    return { success: true, data: { name: fileName, content: fileContent.toString('base64') } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to download file' };
  }
} 