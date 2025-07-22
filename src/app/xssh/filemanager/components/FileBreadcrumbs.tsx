import React, { useState, useRef } from 'react';

export function FileBreadcrumbs({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(path);
  const inputRef = useRef<HTMLInputElement>(null);
  const justFocused = useRef(false);
  const parts = path.split('/').filter(Boolean);
  let current = '';

  const handleEdit = () => {
    setEditValue(path);
    setEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        justFocused.current = true;
      }
    }, 0);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  const handleEditSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    setEditing(false);
    if (editValue !== path) onNavigate(editValue);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (justFocused.current) {
      justFocused.current = false;
      return;
    }
    handleEditSubmit(e);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="px-1.5 py-0.5 rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs w-full max-w-xs"
        value={editValue}
        onChange={handleEditChange}
        onBlur={handleBlur}
        onKeyDown={handleEditSubmit}
        autoFocus
      />
    );
  }

  return (
    <nav className="flex items-center space-x-0.5 text-xs select-none" onDoubleClick={handleEdit} title="Double-click to edit path">
      <button
        className={`px-1.5 py-0.5 rounded-full ${path === '/' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
        onClick={() => onNavigate('/')}
      >
        /
      </button>
      {parts.map((part, idx) => {
        current += '/' + part;
        const isLast = idx === parts.length - 1;
        return (
          <span key={idx} className="flex items-center">
            <svg className="w-3 h-3 text-gray-300 mx-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
            <button
              className={`px-1.5 py-0.5 rounded-full ${isLast ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => onNavigate(current)}
              disabled={isLast}
            >
              {part}
            </button>
          </span>
        );
      })}
    </nav>
  );
} 