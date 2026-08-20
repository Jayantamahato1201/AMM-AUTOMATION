import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { BrandLogo } from '../../components/common/BrandLogo.js';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('admin@ammautomation.com');
  const [password, setPassword] = useState('Admin@12345');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.login(email, password);
      login(data.token, data.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#071324] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#CBD5E1_1px,transparent_1px),linear-gradient(to_bottom,#CBD5E1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-8 space-y-6 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded bg-slate-50 dark:bg-white p-1.5 flex items-center justify-center mx-auto shadow-xs border border-slate-200 dark:border-slate-700">
            <BrandLogo variant="symbol" className="w-full h-full" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AMM AUTOMATION</h2>
          <p className="text-xs text-[#F27D26] font-mono uppercase tracking-widest">
            Management & Content Control Portal
          </p>
        </div>

        {/* Credentials Notice Box */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 p-3 rounded text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Default Staff Credentials:</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Pre-Configured</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">Email: admin@ammautomation.com</p>
          <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">Password: Admin@12345</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs p-3 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ammautomation.com"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
