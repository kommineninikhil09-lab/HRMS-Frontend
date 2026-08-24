'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  const handleMicrosoftLogin = async () => {
    setError('');
    try {
      console.log('Redirecting to Microsoft login...');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex font-['Lato']">
      {/* Left Side - Company Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-600"></div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-16 flex justify-center">
            <div className="text-6xl font-bold text-white">4AT</div>
          </div>

          <p className="text-base text-slate-300 font-normal mb-12 tracking-wide">
            Accounting • Audit • Assurance • Advisory • Tax
          </p>

          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg">
              <div className="text-xs text-purple-300 font-semibold uppercase tracking-widest">HR Portal</div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>

          <p className="text-lg text-slate-200 leading-relaxed font-light max-w-sm">
            Manage your career, connect with colleagues, and grow at 4AT
          </p>

          <div className="mt-12 flex justify-center">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
              E
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
          <p className="text-gray-600 text-base mb-10">Sign in to your account to continue working</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="w-full mb-6 h-12 px-6 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6v-11.4H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            <span>{isLoading ? 'Signing in...' : 'Sign in with Microsoft'}</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-[Lato] text-gray-900 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-[Lato] text-gray-900 disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all mb-6 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm mb-10">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot password?
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Need help?
            </a>
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>© 2024 HRMS Portal. All rights reserved.</p>
            <div className="flex justify-center gap-4 text-blue-600">
              <a href="#" className="hover:text-blue-700">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-700">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
