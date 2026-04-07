'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { loadResume, saveResume } from '@/lib/storage';
import { useResumeHistory } from '@/lib/useResumeHistory';
import { emptyResume } from '@/data/emptyResume';
import { ResumeData } from '@/types/resume';
import { supabase } from '@/lib/supabase';

type View = 'edit' | 'preview';

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');

  const [activeView, setActiveView] = useState<View>('edit');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [resumeName, setResumeName] = useState('Untitled Resume');

  const { resume, set, undo, redo, reset, canUndo, canRedo } = useResumeHistory(emptyResume);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session && resumeId) {
        const { data } = await supabase
          .from('resumes')
          .select('name, data')
          .eq('id', resumeId)
          .eq('user_id', session.user.id)
          .single();
        if (data) {
          reset(data.data as ResumeData);
          setResumeName(data.name);
        }
      } else {
        reset(loadResume());
      }
      setHydrated(true);
    };
    init();
  }, [resumeId, reset]);

  const handleChange = useCallback(async (data: ResumeData) => {
    set(data);
    if (user && resumeId) {
      await supabase
        .from('resumes')
        .update({ data, updated_at: new Date().toISOString() })
        .eq('id', resumeId);
    } else {
      saveResume(data);
    }
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 1500);
  }, [set, user, resumeId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (mod && e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header print:hidden">
        <div className="app-header-inner">
          <div className="flex items-center gap-3">
            <div className="app-logo">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="app-title">SimpleCV</h1>
              {resumeId && (
                <input
                  className="text-xs text-slate-400 bg-transparent border-none outline-none w-40 hover:text-slate-600"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  onBlur={async () => {
                    if (user && resumeId) {
                      await supabase.from('resumes').update({ name: resumeName }).eq('id', resumeId);
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedIndicator && <span className="save-indicator">✓ Saved</span>}
            <div className="flex items-center gap-1">
              <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
                className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 010 16H3m0-16l4-4m-4 4l4 4" />
                </svg>
              </button>
              <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)"
                className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 000 16h10m0-16l-4-4m4 4l-4 4" />
                </svg>
              </button>
            </div>
            {user ? (
              <button onClick={() => router.push('/dashboard')} className="action-btn-secondary text-xs">
                ← My CVs
              </button>
            ) : (
              <button onClick={() => router.push('/login')} className="action-btn-secondary text-xs">
                Sign in to save
              </button>
            )}
            <div className="mobile-view-toggle lg:hidden">
              <button className={`mobile-toggle-btn ${activeView === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveView('edit')}>Edit</button>
              <button className={`mobile-toggle-btn ${activeView === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveView('preview')}>Preview</button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main print:block">
        <div className={`form-panel print:hidden ${activeView === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <ResumeForm data={resume} onChange={handleChange} />
        </div>
        <div className={`preview-panel ${activeView === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <ResumePreview data={resume} />
        </div>
      </main>
    </div>
  );
}
