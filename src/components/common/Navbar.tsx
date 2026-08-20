import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Cpu,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { BrandLogo } from './BrandLogo.js';
import { ThemeToggle } from './ThemeToggle.js';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [industriesDropdown, setIndustriesDropdown] = useState(false);

  const location = useLocation();
  const { content, services, industries, openQuoteModal } = useData();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setIndustriesDropdown(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Solutions',
      path: '/solutions',
      hasDropdown: true,
      items: services.filter(s => s.isActive).map(s => ({ name: s.title, path: `/solutions/${s.slug}` }))
    },
    {
      name: 'Industries',
      path: '/industries',
      hasDropdown: true,
      items: industries.filter(i => i.isActive).map(i => ({ name: i.name, path: `/industries/${i.slug}` }))
    },
    { name: 'Partner Companies', path: '/partners' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const phone = content?.contactPhone || '+91 9204673578';
  const email = content?.contactEmail || 'ammautomationsr@gmail.com';

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-100 dark:bg-[#030812] text-slate-700 dark:text-slate-300 text-xs border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center gap-y-1.5 gap-x-3 text-[11px] sm:text-xs">
          <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#F27D26] transition-colors truncate"
            >
              <Phone className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
              <span className="font-medium truncate">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-[#F27D26] transition-colors truncate"
            >
              <Mail className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
              <span className="truncate">{email}</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-widest font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Plant-Ready Turnkey Industrial Solutions</span>
            </span>
            <Link
              to={user ? '/admin/dashboard' : '/admin/login'}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold transition-colors bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xs"
            >
              <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>{user ? 'Admin Panel' : 'Staff Portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 ${
          isScrolled ? 'shadow-sm py-2.5 sm:py-3' : 'py-3 sm:py-4'
        }`}
      >
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center gap-2">
          {/* Brand Logo with Official Symbol */}
          <Link to="/" className="flex items-center shrink-0">
            <BrandLogo variant="navbar" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6 2xl:space-x-8 text-[11px] xl:text-xs font-semibold uppercase tracking-wider xl:tracking-widest whitespace-nowrap">
            {navLinks.map(link => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));

              if (link.hasDropdown) {
                const isServices = link.name === 'Solutions';
                const isDropdownOpen = isServices ? servicesDropdown : industriesDropdown;
                const setDropdown = isServices ? setServicesDropdown : setIndustriesDropdown;

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setDropdown(true)}
                    onMouseLeave={() => setDropdown(false)}
                  >
                    <Link
                      to={link.path}
                      className={`py-2 transition-colors flex items-center gap-1 ${
                        isActive
                          ? 'text-[#F27D26] font-bold'
                          : 'text-slate-800 dark:text-slate-200 hover:text-[#F27D26] dark:hover:text-[#F27D26]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    {/* Mega/Dropdown Menu */}
                    {isDropdownOpen && link.items && (
                      <div className="absolute left-0 top-full mt-1 w-80 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-fadeIn rounded-xs">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                          {link.name} Catalogue
                        </div>
                        <div className="max-h-96 overflow-y-auto py-1">
                          {link.items.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#F27D26] dark:hover:text-[#F27D26] hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors border-l-2 border-transparent hover:border-[#F27D26]"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <div className="px-4 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#071324] text-center">
                          <Link
                            to={link.path}
                            className="text-xs text-[#F27D26] hover:text-[#d96a1a] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                          >
                            View All {link.name} <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-2 transition-colors ${
                    isActive
                      ? 'text-[#F27D26] font-bold'
                      : 'text-slate-800 dark:text-slate-200 hover:text-[#F27D26] dark:hover:text-[#F27D26]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Area: Theme Toggle + Get a Quote (Hidden on mobile/tablet) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Theme Toggle placed right before Get A Quote button */}
            <ThemeToggle variant="navbar" />

            <button
              onClick={() => openQuoteModal()}
              id="navbar-get-quote-btn"
              className="bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest px-4 xl:px-6 py-2.5 xl:py-3 transition-all flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>GET A QUOTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile & Tablet Menu Actions (< lg) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            <ThemeToggle variant="navbar" />
            <button
              onClick={() => openQuoteModal()}
              className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 uppercase tracking-wider transition-colors"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-800 dark:text-white p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative ml-auto w-[86vw] sm:w-full max-w-sm bg-white dark:bg-[#071324] border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-5 sm:p-6 flex flex-col justify-between shadow-2xl z-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <BrandLogo variant="navbar" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Theme Toggle Section */}
              <div className="mt-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ThemeToggle variant="mobile" />
              </div>

              <div className="mt-4 space-y-1">
                {navLinks.map(link => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== '/' && location.pathname.startsWith(link.path));

                  return (
                    <div key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2.5 text-xs sm:text-sm uppercase tracking-widest font-semibold rounded min-h-[44px] flex items-center ${
                          isActive
                            ? 'text-[#F27D26] bg-orange-500/10 font-bold border-l-2 border-[#F27D26]'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openQuoteModal();
                  }}
                  className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest py-3.5 text-center flex items-center justify-center gap-2 transition-colors shadow-xs min-h-[44px]"
                >
                  <span>Request an Industrial Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-2">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                    <span className="font-medium">{phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                    <span className="truncate">{email}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                to={user ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-semibold text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 py-1"
              >
                <Lock className="w-3 h-3" />
                <span>{user ? 'Admin Dashboard' : 'Staff Portal'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

