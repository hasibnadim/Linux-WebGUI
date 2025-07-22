import React from 'react';

export interface FileItem {
  name: string;
  isDir: boolean;
  size: number;
  mtime: string;
}

export function FileList({
  files,
  onOpen,
  currentPath,
  selected,
  setSelected,
  setContextMenu,
  onRefresh,
}: {
  files: FileItem[];
  onOpen: (name: string, isDir: boolean) => void;
  currentPath: string;
  selected: string[];
  setSelected: (sel: string[]) => void;
  setContextMenu: (ctx: { x: number; y: number; file: FileItem | null } | null) => void;
  onRefresh: () => void;
}) {
  const handleCheckbox = (name: string, checked: boolean) => {
    setSelected(checked ? [...selected, name] : selected.filter(n => n !== name));
  };
  const handleRowClick = (file: FileItem, e: React.MouseEvent) => {
    if (e.detail === 2) onOpen(file.name, file.isDir); // double-click
  };
  const handleContextMenu = (file: FileItem, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };
  return (
    <div className="overflow-auto border border-gray-300 rounded bg-white h-full" style={{ minHeight: 0 }}>
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
          {currentPath !== '/' && (
            <tr className="bg-gray-50 cursor-pointer" onClick={() => onOpen('..', true)}>
              <td className="px-2 py-1 border-b border-gray-100" colSpan={5}>.. (Parent Directory)</td>
            </tr>
          )}
          {files.map((file, idx) => (
            <tr
              key={file.name + idx}
              className={idx % 2 === 0 ? 'bg-gray-50' : ''}
              onClick={e => handleRowClick(file, e)}
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
              <td className="px-2 py-1 border-b border-gray-100">{file.name}</td>
              <td className="px-2 py-1 border-b border-gray-100">{file.isDir ? 'Directory' : 'File'}</td>
              <td className="px-2 py-1 border-b border-gray-100">{file.isDir ? '-' : file.size}</td>
              <td className="px-2 py-1 border-b border-gray-100">{file.mtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 