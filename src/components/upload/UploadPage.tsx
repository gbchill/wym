import { useState, useRef, DragEvent } from 'react';
import type { TransactionSource, UploadResult } from '../../types';

const SOURCES: { value: TransactionSource; label: string; desc: string }[] = [
  {
    value: 'bofa-checking',
    label: 'BofA Checking',
    desc: 'Bank of America checking account export',
  },
  {
    value: 'bofa-credit',
    label: 'BofA Credit Card',
    desc: 'Bank of America credit card export',
  },
  {
    value: 'capitalone',
    label: 'Capital One',
    desc: 'Capital One credit card export',
  },
];

export default function UploadPage() {
  const [source, setSource] = useState<TransactionSource>('bofa-checking');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }

    setUploading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
      } else {
        setResult(data as UploadResult);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-1">Upload CSV</h2>
      <p className="text-slate-400 mb-6">Import transactions from your bank exports.</p>

      {/* Source selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Bank / Source</label>
        <div className="grid grid-cols-3 gap-3">
          {SOURCES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSource(s.value)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                source === s.value
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="font-medium text-sm">{s.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
        }`}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-slate-300 font-medium">Drop your CSV file here</p>
        <p className="text-slate-500 text-sm mt-1">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Status */}
      {uploading && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg text-slate-300 animate-pulse">
          Uploading and parsing...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <h3 className="font-semibold text-green-300 mb-2">Upload Complete</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{result.imported}</div>
              <div className="text-xs text-slate-400">Imported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-400">{result.skipped}</div>
              <div className="text-xs text-slate-400">Skipped (duplicates)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-300">{result.total}</div>
              <div className="text-xs text-slate-400">Total in file</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 text-xs text-red-400">
              {result.errors.length} row error(s): {result.errors.slice(0, 3).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
