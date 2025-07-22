'use client'
import { getPackagesInfo, installPackage, searchAvailablePackage, searchSimilarPackages } from '@/lib/actions/system';
import { useEffect, useState } from 'react';

interface PackageInfo {
  name: string;
  version: string;
}

const POPULAR_SOFTWARE = [
  { label: 'Docker', packages: ['docker', 'docker-ce'] },
  { label: 'C Compiler (gcc)', packages: ['gcc'] },
  { label: 'C++ Compiler (g++)', packages: ['g++'] },
  { label: 'Python 3', packages: ['python3'] },
  { label: 'Python 2', packages: ['python2'] },
  { label: 'Node.js', packages: ['nodejs'] },
  { label: 'npm', packages: ['npm'] },
  { label: 'nvm', packages: ['nvm'] },
  { label: 'Yarn', packages: ['yarn'] },
  { label: 'MySQL', packages: ['mysql-server', 'mysql'] },
  { label: 'PostgreSQL', packages: ['postgresql', 'postgresql-server'] },
  { label: 'MongoDB', packages: ['mongodb', 'mongodb-org'] },
  { label: 'Redis', packages: ['redis-server', 'redis'] },
  { label: 'Apache', packages: ['apache2', 'httpd'] },
  { label: 'Nginx', packages: ['nginx'] },
  { label: 'PHP', packages: ['php'] },
  { label: 'Perl', packages: ['perl'] },
  { label: 'Ruby', packages: ['ruby'] },
  { label: 'Go', packages: ['golang', 'go'] },
  { label: 'Java (OpenJDK)', packages: ['openjdk-11-jdk', 'openjdk-8-jdk', 'java-1.8.0-openjdk'] },
  { label: 'Fail2ban', packages: ['fail2ban'] },
  { label: 'ufw', packages: ['ufw'] },
  { label: 'iptables', packages: ['iptables'] },
  { label: 'Certbot', packages: ['certbot'] },
  { label: 'Supervisor', packages: ['supervisor'] },
  { label: 'tmux', packages: ['tmux'] },
  { label: 'screen', packages: ['screen'] },
  { label: 'htop', packages: ['htop'] },
  { label: 'curl', packages: ['curl'] },
  { label: 'wget', packages: ['wget'] },
  { label: 'zip', packages: ['zip'] },
  { label: 'unzip', packages: ['unzip'] },
  { label: 'git', packages: ['git'] },
  { label: 'vim', packages: ['vim'] },
  { label: 'nano', packages: ['nano'] },
  { label: 'zsh', packages: ['zsh'] },
  { label: 'fish', packages: ['fish'] },
  { label: 'mc', packages: ['mc'] },
  { label: 'build-essential', packages: ['build-essential'] },
  { label: 'make', packages: ['make'] },
  { label: 'cmake', packages: ['cmake'] },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [installName, setInstallName] = useState('');
  const [installStatus, setInstallStatus] = useState('');
  const [installError, setInstallError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean|null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [similar, setSimilar] = useState<string[]>([]);
  const [tab, setTab] = useState<'installed'|'popular'>('installed');
  const [popularInstall, setPopularInstall] = useState<{[pkg: string]: boolean}>({});
  const [popularStatus, setPopularStatus] = useState<{[pkg: string]: string}>({});

  useEffect(() => {
    const fetchPackages = async () => {
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
        const result = await getPackagesInfo(credentials);
        if (result.success) {
          setPackages(result.data || []);
        } else {
          setError(result.error || 'Failed to fetch packages.');
        }
      } catch (err) {
        setError('Failed to fetch packages.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!installName) {
      setIsAvailable(null);
      setSimilar([]);
      return;
    }
    let cancelled = false;
    const check = async () => {
      setIsChecking(true);
      setIsAvailable(null);
      setInstallError('');
      setSimilar([]);
      try {
        const credentialsRaw = sessionStorage.getItem('ssh-credentials');
        if (!credentialsRaw) {
          setInstallError('No SSH credentials found.');
          setIsChecking(false);
          return;
        }
        const credentials = JSON.parse(credentialsRaw);
        const result = await searchAvailablePackage(credentials, installName);
        if (!cancelled) {
          setIsAvailable(result.success ? !!result.data : false);
          if (!(result.success && result.data)) {
            // Not found, search for similar
            const sim = await searchSimilarPackages(credentials, installName);
            if (!cancelled && sim.success && sim.data) setSimilar(sim.data);
          }
        }
      } catch {
        if (!cancelled) setIsAvailable(false);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };
    const timeout = setTimeout(check, 400); // debounce
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [installName]);

  const filteredPackages = search
    ? packages.filter(pkg =>
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.version.toLowerCase().includes(search.toLowerCase())
      )
    : packages;

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstallStatus('');
    setInstallError('');
    setIsInstalling(true);
    try {
      const credentialsRaw = sessionStorage.getItem('ssh-credentials');
      if (!credentialsRaw) {
        setInstallError('No SSH credentials found.');
        setIsInstalling(false);
        return;
      }
      const credentials = JSON.parse(credentialsRaw);
      const result = await installPackage(credentials, installName);
      if (result.success) {
        setInstallStatus('Installed successfully.');
        setInstallName('');
      } else {
        setInstallError(result.error || 'Failed to install package.');
      }
    } catch {
      setInstallError('Failed to install package.');
    } finally {
      setIsInstalling(false);
    }
  };

  // Popular software install handler
  const handlePopularInstall = async (pkg: string) => {
    setPopularInstall(prev => ({ ...prev, [pkg]: true }));
    setPopularStatus(prev => ({ ...prev, [pkg]: '' }));
    try {
      const credentialsRaw = sessionStorage.getItem('ssh-credentials');
      if (!credentialsRaw) {
        setPopularStatus(prev => ({ ...prev, [pkg]: 'No SSH credentials found.' }));
        setPopularInstall(prev => ({ ...prev, [pkg]: false }));
        return;
      }
      const credentials = JSON.parse(credentialsRaw);
      const result = await installPackage(credentials, pkg);
      if (result.success) {
        setPopularStatus(prev => ({ ...prev, [pkg]: 'Installed successfully.' }));
      } else {
        setPopularStatus(prev => ({ ...prev, [pkg]: result.error || 'Failed to install.' }));
      }
    } catch {
      setPopularStatus(prev => ({ ...prev, [pkg]: 'Failed to install.' }));
    } finally {
      setPopularInstall(prev => ({ ...prev, [pkg]: false }));
    }
  };

  // Helper: is a package installed?
  const isAnyInstalled = (names: string[]) =>
    packages.some(pkg => names.includes(pkg.name));

  return (
    <div className="p-2 font-mono text-xs">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-2 py-1 rounded-t bg-gray-200 border-b-0 border border-gray-400 font-bold ${tab === 'installed' ? 'bg-white text-blue-800' : 'text-gray-700'}`}
          onClick={() => setTab('installed')}
        >
          Installed Packages
        </button>
        <button
          className={`px-2 py-1 rounded-t bg-gray-200 border-b-0 border border-gray-400 font-bold ${tab === 'popular' ? 'bg-white text-blue-800' : 'text-gray-700'}`}
          onClick={() => setTab('popular')}
        >
          Popular Software
        </button>
      </div>
      {tab === 'installed' && (
        <>
          <h1 className="text-lg font-bold mb-2">Installed Packages</h1>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              className="border border-gray-300 rounded px-2 py-1 bg-white"
              placeholder="Search installed packages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <form className="flex gap-1 items-center" onSubmit={handleInstall} autoComplete="off">
              <input
                className="border border-gray-300 rounded px-2 py-1 bg-white"
                placeholder="Install package..."
                value={installName}
                onChange={e => setInstallName(e.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded bg-blue-700 text-white disabled:bg-gray-400"
                disabled={!installName || isChecking || !isAvailable || isInstalling}
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              {isChecking && installName && <span className="ml-1 text-gray-500">Checking...</span>}
              {isAvailable === false && installName && !isChecking && (
                <span className="ml-1 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-1">Not found</span>
              )}
              {isAvailable === true && installName && !isChecking && (
                <span className="ml-1 text-green-800 bg-green-100 border border-green-300 rounded-sm px-1">Available</span>
              )}
            </form>
            {isAvailable === false && !isChecking && similar.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-gray-600">Did you mean:</span>
                {similar.map(pkg => (
                  <button
                    key={pkg}
                    type="button"
                    className="px-2 py-0.5 rounded bg-gray-200 border border-gray-400 text-gray-800 hover:bg-blue-100 hover:text-blue-800 font-mono text-xs"
                    onClick={() => setInstallName(pkg)}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
            )}
          </div>
          {installStatus && <div className="text-green-800 bg-green-100 border border-green-300 rounded-sm px-2 py-1 mb-2">{installStatus}</div>}
          {installError && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 mb-2">{installError}</div>}
          {loading && <div>Loading packages...</div>}
          {error && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 mb-2">{error}</div>}
          {!loading && !error && (
            <div className="overflow-auto border border-gray-300 rounded bg-white" style={{ maxHeight: 500 }}>
              <table className="min-w-full text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-2 py-1 border-b border-gray-200">Name</th>
                    <th className="px-2 py-1 border-b border-gray-200">Version</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg, idx) => (
                    <tr key={pkg.name + pkg.version + idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-2 py-1 border-b border-gray-100 truncate max-w-xs">{pkg.name}</td>
                      <td className="px-2 py-1 border-b border-gray-100 truncate max-w-xs">{pkg.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {tab === 'popular' && (
        <>
          <h1 className="text-lg font-bold mb-2">Popular Software</h1>
          <div className="overflow-auto border border-gray-300 rounded bg-white" style={{ maxHeight: 500 }}>
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-2 py-1 border-b border-gray-200">Software</th>
                  <th className="px-2 py-1 border-b border-gray-200">Status</th>
                  <th className="px-2 py-1 border-b border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {POPULAR_SOFTWARE.map((sw, idx) => {
                  const installed = isAnyInstalled(sw.packages);
                  const installing = popularInstall[sw.packages[0]];
                  const statusMsg = popularStatus[sw.packages[0]];
                  return (
                    <tr key={sw.label + idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-2 py-1 border-b border-gray-100 truncate max-w-xs">{sw.label}</td>
                      <td className="px-2 py-1 border-b border-gray-100">
                        {installed ? <span className="text-green-700">Installed</span> : <span className="text-gray-500">Not installed</span>}
                        {statusMsg && <div className="text-xs mt-1">{statusMsg}</div>}
                      </td>
                      <td className="px-2 py-1 border-b border-gray-100">
                        {installed ? null : (
                          <button
                            className="px-2 py-1 rounded bg-blue-700 text-white disabled:bg-gray-400"
                            disabled={installing}
                            onClick={() => handlePopularInstall(sw.packages[0])}
                          >
                            {installing ? 'Installing...' : 'Install'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
