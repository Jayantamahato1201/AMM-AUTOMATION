import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Factory,
  Handshake,
  Inbox,
  FileSpreadsheet,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useData } from '../../context/DataContext.js';
import { BrandLogo } from '../common/BrandLogo.js';
import { ThemeToggle } from '../common/ThemeToggle.js';

export const AdminLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { refreshData } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#071324] flex items-center justify-center text-slate-300 text-sm">
        Checking administration credentials...
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Partner Companies', path: '/admin/partners', icon: Handshake },
    { name: 'Services Management', path: '/admin/services', icon: Cpu },
    { name: 'Industries Management', path: '/admin/industries', icon: Factory },
    { name: 'Quote Requests (RFQs)', path: '/admin/quotes', icon: FileSpreadsheet },
    { name: 'Contact Inquiries', path: '/admin/enquiries', icon: Inbox },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Media Storage', path: '/admin/media', icon: ImageIcon }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#050D1A] flex flex-col md:flex-row text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-white dark:bg-[#071324] text-slate-900 dark:text-white p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <Link to="/" className="flex items-center">
          <BrandLogo variant="admin" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 dark:bg-[#071324] text-slate-700 dark:text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 shadow-sm md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <Link to="/" className="block">
              <BrandLogo variant="admin" />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-50 dark:bg-blue-900/60 text-[#F27D26] dark:text-white border-l-4 border-[#F27D26] font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F27D26]' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#030812] space-y-3 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{user.name}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-mono font-bold">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium py-2 px-3 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <span>Live Website Preview</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex bg-white dark:bg-[#0A192F] border-b border-slate-200 dark:border-slate-800 px-8 py-4 items-center justify-between shadow-xs transition-colors duration-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">AMM Automation Administration</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production Database Active</span>
            </span>

            <ThemeToggle />

            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold text-[#0A192F] dark:text-slate-300 hover:text-[#F27D26] dark:hover:text-[#F27D26] inline-flex items-center gap-1 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Route Output Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
