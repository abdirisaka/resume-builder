'use client';

import { useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';

interface Props {
  onParsed: (data: ResumeData) => void;
}

export default function CVUpload({ onParsed }: Props) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Please upload a PDF or image (PNG, JPG) of your CV.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Max 10MB.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-cv', { method: 'POST', body: formData });
      const json = await res.json();

      if (!res.ok || json.error) {
        setError(json.error || 'Failed to read your CV. Please try again.');
        return;
      }

      onParsed(json.data);
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="cv-upload-wrapper">
      <div
        className={`cv-upload-zone ${dragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !loading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {loading ? (
          <div className="cv-upload-loading">
            <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="mt-3 text-sm font-medium text-slate-600">Reading your CV...</p>
            <p className="text-xs text-slate-400 mt-1">This takes about 10 seconds</p>
          </div>
        ) : success ? (
          <div className="cv-upload-success">
            <div className="cv-upload-success-icon">✓</div>
            <p className="text-sm font-semibold text-emerald-700 mt-2">CV imported successfully!</p>
            <p className="text-xs text-slate-400 mt-1">Click to upload a different CV</p>
          </div>
        ) : (
          <div className="cv-upload-idle">
            <svg className="h-8 w-8 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-semibold text-slate-700">
              {dragging ? 'Drop your CV here' : 'Upload your existing CV'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF or image · Max 10MB</p>
            <span className="cv-upload-btn mt-3">Browse files</span>
          </div>
        )}
      </div>

      {error && (
        <div className="cv-upload-error">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}
    </div>
  );
}
