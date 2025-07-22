'use client';

import { useEffect, useState } from 'react';
import { listUserApplications, ApplicationInfo } from '@/lib/actions/applications';
import { SSHCredentials } from '@/lib/types';

export default function ApplicationListPage() {
  const [credentials, setCredentials] = useState<SSHCredentials | null>(null);
  const [apps, setApps] = useState<ApplicationInfo[]>([]);
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
      try {
        const result = await listUserApplications(credentials);
        setApps(result);
      } catch (e) {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    })();
  }, [credentials]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Applications</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Command</th>
              <th className="px-4 py-2 border-b">PID</th>
              <th className="px-4 py-2 border-b">CPU %</th>
              <th className="px-4 py-2 border-b">Mem %</th>
              <th className="px-4 py-2 border-b">Ports</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 && (
              <tr><td colSpan={6} className="text-center py-4">No user applications found.</td></tr>
            )}
            {apps.map((app) => (
              <tr key={app.pid + app.command}>
                <td className="px-4 py-2 border-b">{app.appType}</td>
                <td className="px-4 py-2 border-b">{app.command}</td>
                <td className="px-4 py-2 border-b">{app.pid}</td>
                <td className="px-4 py-2 border-b">{app.cpu}</td>
                <td className="px-4 py-2 border-b">{app.mem}</td>
                <td className="px-4 py-2 border-b">{app.ports.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
