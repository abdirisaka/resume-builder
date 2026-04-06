'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ResumeData } from '@/types/resume';
import { emptyResume } from '@/data/emptyResume';
import Link from 'next/link';

interface SavedResume {
  id: string;
  name: string;
  updated_at: string;
  data: ResumeData;
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      await loadResumes(session.user.id);
    };
    init();
  }, [router]);

  const loadResumes = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('resumes')
      .select('id, name, updated_at, data')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    setResumes(data ?? []);
    setLoading(false);
  };

  const createNew = async () => {
    setCreating(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('resumes')
      .insert({ user_id: session.user.id, name: 'Untitled Resume', data: emptyResume })
      .select('id')
      .single();

    if (data) router.push(`/?resumeId=${data.id}`);
    setCreating(false);
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    await supabase.from('resumes').delete().eq('id', id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="dashboard-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="flex items-center gap-3">
            <div className="app-logo">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="app-title">ResumeForge</h1>
              <p className="app-subtitle">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="action-btn-secondary text-xs">
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">My Resumes</h2>
            <p className="dashboard-subtitle">Create and manage all your CVs in one place</p>
          </div>
          <button onClick={createNew} disabled={creating} className="download-btn">
            {creating ? 'Creating...' : '+ New Resume'}
          </button>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="dashboard-empty">
            <svg className="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500 font-medium">No resumes yet</p>
            <p className="text-slate-400 text-sm mt-1">Click &quot;+ New Resume&quot; to get started</p>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map((r) => (
              <div key={r.id} className="resume-card">
                <Link href={`/?resumeId=${r.id}`} className="resume-card-body">
                  <div className="resume-card-icon">
                    <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="resume-card-name">{r.name}</div>
                    <div className="resume-card-meta">
                      {r.data?.personal?.fullName || 'No name yet'} · Updated {formatDate(r.updated_at)}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => deleteResume(r.id)}
                  className="resume-card-delete"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
