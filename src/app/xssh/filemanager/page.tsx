'use client'
import { useEffect, useState } from 'react';
import {
  listDirectory,
  createDirectory,
  createFile,
  deleteFile,
  downloadFile,
  compressFiles,
  extractFile,
} from '@/lib/actions/filemanager';
import { FileList, FileItem } from './components/FileList';
import { FileBreadcrumbs } from './components/FileBreadcrumbs';
import { FileUpload } from './components/FileUpload';
import React, { useRef } from 'react';
import { Home, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, Eye, EyeOff, Plus, Upload, Folder, FileText } from 'lucide-react';

const SIDEBAR_LINKS = [
  { label: 'Home', path: '/home', icon: <Home className="w-4 h-4 mr-2" /> },
  { label: 'Root', path: '/', icon: <Folder className="w-4 h-4 mr-2" /> },
  { label: 'etc', path: '/etc', icon: <Folder className="w-4 h-4 mr-2" /> },
  { label: 'var', path: '/var', icon: <Folder className="w-4 h-4 mr-2" /> },
  { label: 'mnt', path: '/mnt', icon: <Folder className="w-4 h-4 mr-2" /> },
  { label: 'media', path: '/media', icon: <Folder className="w-4 h-4 mr-2" /> },
];

function ContextMenu({ x, y, file, selected, onAction, onClose }: {
  x: number;
  y: number;
  file: any;
  selected: string[];
  onAction: (action: string) => void;
  onClose: () => void;
}) {
  const isMulti = selected.length > 1;
  const menuRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border rounded shadow-lg text-sm"
      style={{ left: x, top: y, minWidth: 160 }}
      onContextMenu={e => e.preventDefault()}
    >
      <div className="px-3 py-2 font-semibold border-b">{isMulti ? `${selected.length} items` : file?.name}</div>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => onAction('extract')}>Extract</button>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => onAction('compress')}>Compress</button>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => onAction('download')}>Download</button>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600" onClick={() => onAction('delete')}>Delete</button>
      <div className="border-t my-1" />
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => onAction('new-folder')}>New Folder</button>
      <button className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => onAction('new-file')}>New File</button>
    </div>
  );
}

export default function FileManagerPage() {
  const [path, setPath] = useState<string>('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileItem | null } | null>(null);
  const fileListRef = React.useRef<HTMLDivElement>(null);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; percent: number } | null>(null);
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
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
        const result = await listDirectory(credentials, path);
        if (result.success) {
          setFiles(result.data?.files || []);
        } else {
          setError(result.error || 'Failed to list directory.');
        }
      } catch {
        setError('Failed to list directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [path, refreshKey]);

  const handleOpen = (name: string, isDir: boolean) => {
    if (!isDir) return;
    if (name === '..') {
      const parts = path.split('/').filter(Boolean);
      setPath('/' + parts.slice(0, -1).join('/'));
    } else {
      setPath(path === '/' ? `/${name}` : `${path}/${name}`);
    }
  };

  const handleNavigate = (newPath: string) => {
    setPath(newPath);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleBack = () => {
    if (path === '/') return;
    const parts = path.split('/').filter(Boolean);
    setPath('/' + parts.slice(0, -1).join('/'));
  };

  // Context menu close on click outside or ESC
  React.useEffect(() => {
    if (!contextMenu) return;
    const close = (e: any) => {
      const menu = document.querySelector('.fixed.z-50.bg-white.border.rounded.shadow-lg.text-sm');
      if (menu && menu.contains(e.target)) return;
      setContextMenu(null);
    };
    const esc = (e: any) => { if (e.key === 'Escape') setContextMenu(null); };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [contextMenu]);

  // Refactor handleContextAction to accept an optional file/selection context
  const handleContextAction = async (action: string, opts?: { file?: FileItem | null; selection?: string[] }) => {
    setContextMenu(null);
    const credentialsRaw = sessionStorage.getItem('ssh-credentials');
    if (!credentialsRaw) return alert('No SSH credentials found.');
    const credentials = JSON.parse(credentialsRaw);
    let targets: string[] = [];
    if (opts?.selection && opts.selection.length > 0) {
      targets = opts.selection;
    } else if (opts?.file) {
      targets = [opts.file.name];
    } else if (selected.length > 0) {
      targets = selected;
    } else if (contextMenu?.file) {
      targets = [contextMenu.file.name];
    }
    const fullPaths = targets.map(name => path === '/' ? `/${name}` : `${path}/${name}`);
    try {
      if (action === 'delete') {
        if (confirm('Are you sure you want to delete these files?')) {
          if (fullPaths.length === 0) return alert('No file(s) selected.');
          const res = await deleteFile(credentials, fullPaths);
          if (!res.success) alert(res.error);
        }
      } else if (action === 'download') {
        if (fullPaths.length === 0) return alert('No file(s) selected.');
        for (const filePath of fullPaths) {
          const res = await downloadFile(credentials, filePath);
          if (res.success && res.data) {
            const a = document.createElement('a');
            a.href = `data:application/octet-stream;base64,${res.data.content}`;
            a.download = res.data.name;
            a.click();
          } else {
            alert(res.error);
          }
        }
      } else if (action === 'compress') {
        if (fullPaths.length === 0) return alert('No file(s) selected.');
        const archiveName = prompt('Archive name (e.g. files.tar.gz):', 'archive.tar.gz');
        if (!archiveName) return;
        const destArchive = path === '/' ? `/${archiveName}` : `${path}/${archiveName}`;
        const res = await compressFiles(credentials, fullPaths, destArchive);
        if (!res.success) alert(res.error);
      } else if (action === 'extract') {
        let archivePath = '';
        if (fullPaths.length > 0) archivePath = fullPaths[0];
        else archivePath = contextMenu?.file ? (path === '/' ? `/${contextMenu.file.name}` : `${path}/${contextMenu.file.name}`) : '';
        if (!archivePath) return alert('No archive selected.');
        const destDir = prompt('Extract to directory:', path);
        if (!destDir) return;
        const res = await extractFile(credentials, archivePath, destDir);
        if (!res.success) alert(res.error);
      } else if (action === 'new-folder') {
        const folderName = prompt('New folder name:');
        if (!folderName) return;
        const folderPath = path === '/' ? `/${folderName}` : `${path}/${folderName}`;
        const res = await createDirectory(credentials, folderPath);
        if (!res.success) alert(res.error);
      } else if (action === 'new-file') {
        const fileName = prompt('New file name:');
        if (!fileName) return;
        const filePath = path === '/' ? `/${fileName}` : `${path}/${fileName}`;
        const res = await createFile(credentials, filePath);
        if (!res.success) alert(res.error);
      }
    } catch (e: any) {
      alert(e?.message || 'Action failed');
    }
    setSelected([]);
    handleRefresh();
  };

  // Sidebar navigation
  const handleSidebarNav = (navPath: string) => {
    setPath(navPath);
  };

  // Up button
  const handleUp = () => {
    if (path === '/') return;
    const parts = path.split('/').filter(Boolean);
    setPath('/' + parts.slice(0, -1).join('/'));
  };

  // Home button
  const handleHome = () => {
    setPath('/home');
  };

  // File/folder icon helper
  const getIcon = (file: FileItem) => file.isDir ? <Folder className="inline w-4 h-4 text-blue-600 mr-1" /> : <FileText className="inline w-4 h-4 text-gray-500 mr-1" />;

  // Filter files based on search and show hidden
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const isHidden = file.name.startsWith('.');
    return matchesSearch && (!showHidden || !isHidden);
  });

  // Handle row click for navigation or selection
  const handleRowClick = (file: FileItem, event: React.MouseEvent) => {
    if (file.isDir) {
      handleOpen(file.name, true);
    } else {
      // For files, we can add a download action here if needed
      // For now, it just opens the context menu
      setContextMenu({ x: event.clientX, y: event.clientY, file });
    }
  };

  // Handle context menu for files
  const handleContextMenu = (file: FileItem, event: React.MouseEvent) => {
    event.preventDefault();
    // If right-clicked file is not selected, select only it
    if (!selected.includes(file.name)) {
      setSelected([file.name]);
    }
    setContextMenu({ x: event.clientX, y: event.clientY, file });
  };

  // Handle checkbox selection
  const handleCheckbox = (name: string, checked: boolean) => {
    setSelected(prev => checked ? [...prev, name] : prev.filter(n => n !== name));
  };

  return (
    <div className="flex h-screen bg-gray-50 rounded shadow overflow-hidden">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-white sticky top-0 z-10">
          <button className="icon-btn" onClick={handleBack} disabled={path === '/'} title="Back"><ArrowLeft className="w-5 h-5" /></button>
          <button className="icon-btn" onClick={handleRefresh} title="Refresh"><RefreshCw className="w-5 h-5" /></button>
          <button className="icon-btn" onClick={handleHome} title="Home"><Home className="w-5 h-5" /></button>
          {/* Breadcrumbs as path bar */}
          <div className="flex-1 mx-2">
            <FileBreadcrumbs path={path} onNavigate={handleNavigate} />
          </div>
          {/* Search bar */}
          <div className="relative max-w-xs ml-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="block w-full pl-9 pr-3 py-1.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm placeholder-gray-400 transition"
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search files"
            />
          </div>
          {/* Show hidden toggle */}
          <button className="icon-btn ml-2" onClick={() => setShowHidden(v => !v)} title="Show/Hide Hidden">
            {showHidden ? <Eye className="w-5 h-5 text-blue-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
          </button>
          {/* New folder/file/upload */}
          <button className="icon-btn ml-2" onClick={() => handleContextAction('new-folder')} title="New Folder"><Plus className="w-5 h-5" /></button>
          <button className="icon-btn" onClick={() => handleContextAction('new-file')} title="New File"><FileText className="w-5 h-5" /></button>
          <FileUpload currentPath={path} onUpload={handleRefresh} setUploadProgress={setUploadProgress} />
        </div>
        {/* File List */}
        <div className="flex-1 overflow-auto px-0 pb-0 bg-white">
          <table className="min-w-full text-left select-none">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-2 py-1 border-b border-gray-200 w-8"></th>
                <th className="px-2 py-1 border-b border-gray-200">Name</th>
                <th className="px-2 py-1 border-b border-gray-200">Type</th>
                <th className="px-2 py-1 border-b border-gray-200">Size</th>
                <th className="px-2 py-1 border-b border-gray-200">Modified</th>
              </tr>
            </thead>
            <tbody>
              {path !== '/' && (
                <tr className="bg-gray-50 cursor-pointer" onClick={handleUp}>
                  <td className="px-2 py-1 border-b border-gray-100" colSpan={5}>.. (Parent Directory)</td>
                </tr>
              )}
              {filteredFiles.map((file, idx) => (
                <tr
                  key={file.name + idx}
                  className={`group ${idx % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-blue-50 ${selected.includes(file.name) ? 'bg-blue-100' : ''}`}
                  onClick={e => handleRowClick(file, e)}
                  onDoubleClick={e => { if (file.isDir) handleOpen(file.name, true); }}
                  onContextMenu={e => handleContextMenu(file, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="px-2 py-1 border-b border-gray-100">
                    <input
                      type="checkbox"
                      checked={selected.includes(file.name)}
                      onChange={e => handleCheckbox(file.name, e.target.checked)}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-2 py-1 border-b border-gray-100 flex items-center">
                    {getIcon(file)}{file.name}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-100">{file.isDir ? 'Directory' : 'File'}</td>
                  <td className="px-2 py-1 border-b border-gray-100">{file.isDir ? '-' : file.size}</td>
                  <td className="px-2 py-1 border-b border-gray-100">{file.mtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x ?? 0}
              y={contextMenu.y ?? 0}
              file={contextMenu.file ?? null}
              selected={selected}
              onAction={(action) => handleContextAction(action, { file: contextMenu.file, selection: selected })}
              onClose={() => setContextMenu(null)}
            />
          )}
        </div>
        {/* Bottom bar */}
        <div className="h-8 px-4 flex items-center text-xs bg-gray-100 border-t text-gray-600">
          <span>{filteredFiles.length} items</span>
          {selected.length > 0 && <span className="ml-4">{selected.length} selected</span>}
        </div>
      </div>
      {/* Sidebar (right) */}
      <aside className="w-32 bg-white border-l flex flex-col py-4">
        <div className="px-4 pb-2 text-xs font-bold text-gray-700">PLACES</div>
        {SIDEBAR_LINKS.map(link => (
          <button
            key={link.path}
            className={`flex items-center px-4 py-2 text-sm w-full text-left hover:bg-blue-50 ${path === link.path ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
            onClick={() => handleSidebarNav(link.path)}
          >
            {link.icon}{link.label}
          </button>
        ))}
      </aside>
    </div>
  );
}
