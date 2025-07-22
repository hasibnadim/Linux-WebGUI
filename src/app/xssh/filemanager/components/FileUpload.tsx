import React, { useRef, useState } from 'react';
import { uploadFile } from '@/lib/actions/filemanager';

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

export function FileUpload({ currentPath, onUpload, setUploadProgress }: { currentPath: string; onUpload: () => void; setUploadProgress: (p: { name: string; percent: number } | null) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      if (file.size > MAX_UPLOAD_SIZE) {
        setError('File size exceeds 10GB limit.');
        continue;
      }
      setProgress(0);
      setUploading(true);
      setUploadProgress({ name: file.name, percent: 0 });
      const credentialsRaw = sessionStorage.getItem('ssh-credentials');
      if (!credentialsRaw) {
        setError('No SSH credentials found.');
        setProgress(null);
        setUploading(false);
        setUploadProgress(null);
        return;
      }
      const credentials = JSON.parse(credentialsRaw);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        let fakeProgress = 0;
        const interval = setInterval(() => {
          fakeProgress += 10;
          setProgress(Math.min(fakeProgress, 95));
          setUploadProgress({ name: file.name, percent: Math.min(fakeProgress, 95) });
        }, 100);
        const result = await uploadFile(credentials, currentPath, file.name, base64);
        clearInterval(interval);
        setProgress(100);
        setUploadProgress({ name: file.name, percent: 100 });
        if (result.success) {
          onUpload();
        } else {
          setError(result.error || 'Failed to upload file.');
        }
        setTimeout(() => { setProgress(null); setUploadProgress(null); setUploading(false); }, 800);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setProgress(null);
        setUploading(false);
        setUploadProgress(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn"
        onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
        disabled={uploading}
      >
        {uploading && progress !== null ? `Uploading ${progress}%` : 'Upload'}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        multiple
      />
      {error && <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-sm px-2 py-1 ml-2">{error}</div>}
    </div>
  );
} 