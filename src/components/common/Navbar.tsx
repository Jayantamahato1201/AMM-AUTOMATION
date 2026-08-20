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
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const phone = content?.contactPhone || '+91 9204673578';
  const email = content?.contactEmail || 'ammautomationsr@gmail.com';

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#050D1A] text-slate-300 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#F27D26] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
              <span className="font-medium">{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#F27D26] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{email}</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 uppercase text-[10px] tracking-widest font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plant-Ready Turnkey Industrial Solutions</span>
            </span>
            <Link
              to={user ? '/admin/dashboard' : '/admin/login'}
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2.5 py-0.5 text-[11px] uppercase tracking-wider font-semibold transition-colors bg-slate-800/80 hover:bg-slate-700"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{user ? 'Admin Panel' : 'Staff Portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-white border-b border-slate-100 ${
          isScrolled ? 'shadow-sm py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Brand Logo with Official Symbol */}
          <Link to="/" className="flex items-center">
            <BrandLogo variant="navbar" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-semibold uppercase tracking-widest">
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
                          : 'text-[#0A192F] hover:text-[#F27D26]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    {/* Mega/Dropdown Menu */}
                    {isDropdownOpen && link.items && (
                      <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {link.name} Catalogue
                        </div>
                        <div className="max-h-96 overflow-y-auto py-1">
                          {link.items.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="block px-4 py-2 text-xs font-medium text-slate-700 hover:text-[#F27D26] hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-[#F27D26]"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                        <div className="px-4 pt-2 pb-1 border-t border-slate-100 bg-slate-50 text-center">
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
                      : 'text-[#0A192F] hover:text-[#F27D26]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openQuoteModal()}
              id="navbar-get-quote-btn"
              className="bg-[#0A192F] hover:bg-[#F27D26] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 transition-all flex items-center gap-2"
            >
              <span>GET A QUOTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openQuoteModal()}
              className="bg-[#F27D26] text-white font-bold text-xs px-3 py-1.5 uppercase tracking-wider"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#0A192F] p-2 hover:bg-slate-100"
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
          <div className="relative ml-auto w-full max-w-sm bg-white border-l border-slate-200 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl z-10 text-[#0A192F]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <BrandLogo variant="navbar" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-[#0A192F] p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {navLinks.map(link => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== '/' && location.pathname.startsWith(link.path));

                  return (
                    <div key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2.5 text-sm uppercase tracking-widest font-semibold ${
                          isActive
                            ? 'text-[#F27D26] bg-orange-50 font-bold border-l-2 border-[#F27D26]'
                            : 'text-[#0A192F] hover:bg-slate-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openQuoteModal();
                  }}
                  className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest py-3.5 text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Request an Industrial Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-500 space-y-2 pt-2">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span className="font-medium">{phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
                    <span>{email}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <Link
                to={user ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-semibold text-slate-400 hover:text-[#0A192F] inline-flex items-center gap-1"
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
