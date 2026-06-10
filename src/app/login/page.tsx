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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 font-sans p-4">
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-12 w-full max-w-md flex flex-col items-center relative overflow-hidden">
        {/* Top Highlight/Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-400/20 blur-[60px] rounded-full pointer-events-none"></div>

        {/* Shield Icon Container */}
        <div className="w-20 h-20 bg-blue-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 z-10">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Secure Access Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 z-10">
          <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[11px] font-semibold text-blue-500 tracking-wide">Secure Access</span>
        </div>

        {/* Headings */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 z-10 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 text-[15px] mb-8 text-center z-10">Sign in to access your inventory dashboard</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full z-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Sign In
              </>
            )}
          </button>
          
          <div className="mt-5 text-right">
            <Link href="#" className="text-[13px] text-blue-500 hover:text-blue-600 font-medium">
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="w-full mt-8 bg-yellow-50/50 border border-yellow-100/80 rounded-2xl p-4 flex gap-3 z-10">
          <div className="mt-0.5">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 mb-1">Demo Credentials</h3>
            <div className="text-[13px] text-gray-600 flex flex-col gap-0.5">
              <p><span className="font-semibold text-gray-800">Username:</span> inventory</p>
              <p><span className="font-semibold text-gray-800">Password:</span> 123456</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
