'use client';

import { useEffect, useState } from 'react';
import {
  isGitInstalled,
  isNvmInstalled,
  isNodeInstalled,
  isPm2Installed,
  isPythonInstalled,
  isDockerInstalled,
  isApacheInstalled,
  isNginxInstalled,
  isMysqlInstalled,
  isPostgresInstalled,
} from '@/lib/actions/software';
import { SSHCredentials } from '@/lib/types';

const SOFTWARE_LIST = [
  { key: 'git', label: 'Git', check: isGitInstalled },
  { key: 'nvm', label: 'NVM', check: isNvmInstalled },
  { key: 'node', label: 'Node.js', check: isNodeInstalled },
  { key: 'pm2', label: 'PM2', check: isPm2Installed },
  { key: 'python', label: 'Python', check: isPythonInstalled },
  { key: 'docker', label: 'Docker', check: isDockerInstalled },
  { key: 'apache', label: 'Apache', check: isApacheInstalled },
  { key: 'nginx', label: 'Nginx', check: isNginxInstalled },
  { key: 'mysql', label: 'MySQL', check: isMysqlInstalled },
  { key: 'postgres', label: 'PostgreSQL', check: isPostgresInstalled },
];

export default function SoftwareStatusPage() {
  const [credentials, setCredentials] = useState<SSHCredentials | null>(null);
  const [results, setResults] = useState<Record<string, string | null | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const credStr = sessionStorage.getItem('ssh-credentials');
    if (!credStr) {
      setError('No SSH credentials found.');
      setLoading(false);
      return;
    }
    try {
      const creds = JSON.parse(credStr);
      setCredentials(creds);
    } catch {
      setError('Invalid SSH credentials format.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!credentials) return;
    setLoading(true);
    setError(null);
    (async () => {
      const res: Record<string, string | null> = {};
      for (const sw of SOFTWARE_LIST) {
        try {
          res[sw.key] = await sw.check(credentials);
        } catch (e) {
          res[sw.key] = null;
        }
      }
      setResults(res);
      setLoading(false);
    })();
  }, [credentials]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Software Status</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Software</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Version/Info</th>
            </tr>
          </thead>
          <tbody>
            {SOFTWARE_LIST.map((sw) => {
              const value = results[sw.key];
              return (
                <tr key={sw.key}>
                  <td className="px-4 py-2 border-b">{sw.label}</td>
                  <td className="px-4 py-2 border-b">
                    {value === undefined ? 'Checking...' : value ? 'Installed' : 'Not Installed'}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {value && value !== '1' ? value : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
