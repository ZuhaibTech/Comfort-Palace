'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        // If login is successful, store some token/state if required and redirect
        // Since we are mocking or adapting the backend, we redirect to dashboard
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50/30 font-sans p-6 mt-[12dvh]">
      <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-10 sm:p-16 w-full max-w-lg flex flex-col items-center relative overflow-hidden border border-surface-100">
        {/* Top Highlight/Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary-200/20 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Shield Icon Container */}
        <div className="w-24 h-24 bg-primary-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-900/20 mb-8 z-10 transition-transform duration-700 hover:rotate-[360deg]">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Secure Access Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50/50 border border-primary-100 mb-8 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-800 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-800">Secure Gateway</span>
        </div>

        {/* Headings */}
        <h1 className="font-display text-4xl lg:text-5xl font-light text-black mb-3 z-10 tracking-tighter">Welcome Back</h1>
        <p className="text-surface-500 text-lg font-light mb-10 text-center z-10 opacity-80 italic">Access the Palace inventory console</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full z-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl text-center animate-[shake_0.5s_ease-in-out]">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 pl-2" htmlFor="username">
              Credentials ID
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-6 py-4 rounded-2xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-800/5 focus:border-primary-800 transition-all bg-surface-50/50 text-black placeholder:text-surface-300"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 pl-2" htmlFor="password">
              Secure Key
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-6 py-4 rounded-2xl border border-surface-200 focus:outline-none focus:ring-4 focus:ring-primary-800/5 focus:border-primary-800 transition-all bg-surface-50/50 text-black placeholder:text-surface-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-900 hover:bg-black text-white font-bold uppercase tracking-[0.2em] text-[11px] py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary-900/20 disabled:opacity-70 group"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Authorize Access
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
          
          <div className="text-center pt-2">
            <Link href="#" className="text-[11px] font-bold uppercase tracking-widest text-primary-800 hover:text-black transition-colors">
              Reset Security Credentials
            </Link>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="w-full mt-12 bg-surface-50 border border-surface-100 rounded-[2rem] p-6 flex gap-4 z-10 transition-all hover:bg-white hover:shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-white border border-surface-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-1">Administrative Access</h3>
            <div className="text-[13px] text-surface-500 font-light flex flex-col gap-0.5">
              <p>ID: <span className="text-black font-medium">inventory</span></p>
              <p>Key: <span className="text-black font-medium">123456</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
