'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDashboardOverview } from '@/lib/actions/system';
import { IDashboardOverview } from '@/lib/types';

export default function DashboardOverview() {
  const [data, setData] = useState<IDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const credentialsRaw = sessionStorage.getItem('ssh-credentials');
        if (!credentialsRaw) {
          setError('No SSH credentials found.');
          setLoading(false);
          return;
        }
        const credentials = JSON.parse(credentialsRaw);
        const result = await getDashboardOverview(credentials);
        if (result.success) {
          setData(result.data || null);
        } else {
          setError(result.error || 'Failed to fetch dashboard info.');
        }
      } catch {
        setError('Failed to fetch dashboard info.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">System Overview</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 mb-2">{error}</div>}
      {!loading && !error && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {/* System Cards */}
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">CPU</h2>
            <div className="text-gray-700">Usage: <span className="font-semibold">{data.cpu.usage}</span></div>
            <div className="text-gray-700">Cores: <span className="font-semibold">{data.cpu.cores}</span></div>
            <Link href="/xssh/system/cpu" className="text-blue-700 underline text-xs mt-2">Details</Link>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">Memory</h2>
            <div className="text-gray-700">Usage: <span className="font-semibold">{data.memory.usage} / {data.memory.total}</span></div>
            <div className="text-gray-700">Free: <span className="font-semibold">{data.memory.free}</span></div>
            <Link href="/xssh/system/memory" className="text-blue-700 underline text-xs mt-2">Details</Link>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">Disk</h2>
            <div className="text-gray-700">Usage: <span className="font-semibold">{data.disk.usage} / {data.disk.total}</span></div>
            <div className="text-gray-700">Free: <span className="font-semibold">{data.disk.free}</span></div>
            <Link href="/xssh/system/disk" className="text-blue-700 underline text-xs mt-2">Details</Link>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">Network</h2>
            <div className="text-gray-700">Status: <span className="font-semibold">{data.network.status}</span></div>
            <div className="text-gray-700">IP: <span className="font-semibold">{data.network.ip}</span></div>
            <Link href="/xssh/system/network" className="text-blue-700 underline text-xs mt-2">Details</Link>
          </div>
          {/* Software Card */}
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">Software</h2>
            <div className="text-gray-700">Installed Packages: <span className="font-semibold">{data.software.packageCount}</span></div>
            <div className="text-gray-700">Key Software: <span className="font-semibold">{data.software.keySoftware.join(', ') || '--'}</span></div>
            <Link href="/xssh/software/packages" className="text-blue-700 underline text-xs mt-2">Manage Packages</Link>
          </div>
          {/* Security Card */}
          <div className="bg-white border border-gray-300 rounded p-4 flex flex-col gap-2 shadow-sm">
            <h2 className="font-bold text-blue-900 mb-1">Security</h2>
            <div className="text-gray-700">Firewall: <span className="font-semibold">{data.security.firewall}</span></div>
            <div className="text-gray-700">Open Ports: <span className="font-semibold">{data.security.openPorts.join(', ') || '--'}</span></div>
            <Link href="/xssh/security/host-domain" className="text-blue-700 underline text-xs mt-2">Security Settings</Link>
          </div>
        </div>
      )}
      <div className="mt-8 text-gray-600 text-xs">
        <p>Welcome to your Linux WebGUI dashboard. Here you can monitor system health, manage software, and keep your server secure. All stats update in real time when implemented.</p>
      </div>
    </div>
  );
}
