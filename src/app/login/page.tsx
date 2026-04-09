'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); } else router.push('/dashboard');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' });
    if (error) { setError(error.message); setLoading(false); } else { setResetSent(true); setLoading(false); }
  };

  if (resetSent) return (
    <div className="auth-shell"><div className="auth-card text-center">
      <h1 className="auth-title">Check your email</h1>
      <p className="auth-subtitle">Password reset link sent to <strong>{email}</strong>. Check spam too.</p>
      <button onClick={() => { setMode('login'); setResetSent(false); }} className="auth-btn mt-4">Back to sign in</button>
    </div></div>
  );

  if (mode === 'forgot') return (
    <div className="auth-shell"><div className="auth-card">
      <h1 className="auth-title">Reset password</h1>
      <p className="auth-subtitle">We will send a reset link to your email.</p>
      <form onSubmit={handleForgot} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <div><label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <button type="submit" disabled={loading} className="auth-btn">{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>
      <p className="auth-switch"><button onClick={() => setMode('login')} className="auth-link">Back to sign in</button></p>
    </div></div>
  );

  return (
    <div className="auth-shell"><div className="auth-card">
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your SimpleCV account</p>
      <form onSubmit={handleLogin} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <div><label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <div className="text-right"><button type="button" onClick={() => setMode('forgot')} className="text-xs text-indigo-600 hover:underline">Forgot password?</button></div>
        <button type="submit" disabled={loading} className="auth-btn">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">No account? <Link href="/signup" className="auth-link">Sign up free</Link></p>
    </div></div>
  );
}
