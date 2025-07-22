'use client'
import { useEffect, useState } from 'react';
import { getNetworkInfo, getSSLInfo } from '@/lib/actions/system';

export default function NetworkPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ssl, setSSL] = useState<any>(null);
  const [sslLoading, setSSLLoading] = useState(true);
  const [sslError, setSSLError] = useState('');

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
        const result = await getNetworkInfo(credentials);
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch network info.');
        }
      } catch {
        setError('Failed to fetch network info.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSSL = async () => {
      setSSLLoading(true);
      setSSLError('');
      try {
        const credentialsRaw = sessionStorage.getItem('ssh-credentials');
        if (!credentialsRaw) {
          setSSLError('No SSH credentials found.');
          setSSLLoading(false);
          return;
        }
        const credentials = JSON.parse(credentialsRaw);
        const result = await getSSLInfo(credentials);
        if (result.success) {
          setSSL(result.data);
        } else {
          setSSLError(result.error || 'Failed to fetch SSL info.');
        }
      } catch {
        setSSLError('Failed to fetch SSL info.');
      } finally {
        setSSLLoading(false);
      }
    };
    fetchSSL();
  }, []);

  return (
    <div className="p-4 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">Network Information</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 mb-2">{error}</div>}
      {!loading && !error && data && (
        <>
          <h2 className="text-lg font-bold mb-2">Interfaces</h2>
          <div className="overflow-auto border border-gray-300 rounded bg-white mb-6" style={{ maxHeight: 300 }}>
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-2 py-1 border-b border-gray-200">Name</th>
                  <th className="px-2 py-1 border-b border-gray-200">IP Address</th>
                  <th className="px-2 py-1 border-b border-gray-200">RX Bytes</th>
                  <th className="px-2 py-1 border-b border-gray-200">TX Bytes</th>
                </tr>
              </thead>
              <tbody>
                {data.interfaces.map((iface: any, idx: number) => (
                  <tr key={iface.name + idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-2 py-1 border-b border-gray-100">{iface.name}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{iface.ip}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{iface.rx}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{iface.tx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="text-lg font-bold mb-2">Active Connections</h2>
          <div className="overflow-auto border border-gray-300 rounded bg-white mb-6" style={{ maxHeight: 300 }}>
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-2 py-1 border-b border-gray-200">Proto</th>
                  <th className="px-2 py-1 border-b border-gray-200">Local Address</th>
                  <th className="px-2 py-1 border-b border-gray-200">Remote Address</th>
                  <th className="px-2 py-1 border-b border-gray-200">State</th>
                </tr>
              </thead>
              <tbody>
                {data.connections.map((conn: any, idx: number) => (
                  <tr key={conn.proto + conn.local + conn.remote + idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-2 py-1 border-b border-gray-100">{conn.proto}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{conn.local}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{conn.remote}</td>
                    <td className="px-2 py-1 border-b border-gray-100">{conn.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <h2 className="text-lg font-bold mb-2 mt-8">SSL Certificate</h2>
      {sslLoading && <div>Loading SSL info...</div>}
      {sslError && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 mb-2">{sslError}</div>}
      {!sslLoading && !sslError && ssl && (
        <div className="bg-white border border-gray-300 rounded p-4 mb-6">
          <div className="mb-1"><span className="font-bold">Subject:</span> {ssl.subject}</div>
          <div className="mb-1"><span className="font-bold">Issuer:</span> {ssl.issuer}</div>
          <div className="mb-1"><span className="font-bold">Valid From:</span> {ssl.validFrom}</div>
          <div className="mb-1"><span className="font-bold">Valid To:</span> {ssl.validTo}</div>
          <div className="mb-1"><span className="font-bold">SANs:</span> {ssl.san && ssl.san.length > 0 ? ssl.san.join(', ') : '--'}</div>
        </div>
      )}
    </div>
  );
}
