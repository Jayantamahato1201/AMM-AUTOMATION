import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { DataProvider } from './context/DataContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { WhatsAppButton } from './components/common/WhatsAppButton.js';
import { QuoteModal } from './components/common/QuoteModal.js';
import { ScrollToTop } from './components/common/ScrollToTop.js';

// Public Pages
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { SolutionsPage } from './pages/SolutionsPage.js';
import { SolutionDetailPage } from './pages/SolutionDetailPage.js';
import { IndustriesPage } from './pages/IndustriesPage.js';
import { IndustryDetailPage } from './pages/IndustryDetailPage.js';
import { PartnersPage } from './pages/PartnersPage.js';
import { ContactPage } from './pages/ContactPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminPartnersPage } from './pages/admin/AdminPartnersPage.js';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.js';
import { AdminIndustriesPage } from './pages/admin/AdminIndustriesPage.js';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage.js';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage.js';
import { AdminContentPage } from './pages/admin/AdminContentPage.js';
import { AdminMediaPage } from './pages/admin/AdminMediaPage.js';

// Public Website Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#F27D26] selection:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <QuoteModal />
    </div>
  );
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#050D1A]">
      <div className="max-w-md space-y-4">
        <div className="text-4xl font-extrabold text-[#0A192F] dark:text-[#F27D26] font-mono">404</div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          The requested page does not exist or has been moved within our engineering directory.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white text-xs font-semibold px-5 py-2.5 transition-colors"
        >
          Return to AMM Automation Home
        </Link>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Customer-Facing Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/solutions/:slug" element={<SolutionDetailPage />} />
                <Route path="/industries" element={<IndustriesPage />} />
                <Route path="/industries/:slug" element={<IndustryDetailPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/partner-companies" element={<PartnersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Redirect old portfolio routes to home */}
                <Route path="/portfolio" element={<Navigate to="/" replace />} />
                <Route path="/portfolio/*" element={<Navigate to="/" replace />} />
                <Route path="/projects" element={<Navigate to="/" replace />} />
                <Route path="/projects/*" element={<Navigate to="/" replace />} />
              </Route>

              {/* Standalone Admin Login & Direct Aliases */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/signin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/auth/login" element={<Navigate to="/admin/login" replace />} />

              {/* Protected Admin Control Center */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="partners" element={<AdminPartnersPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="industries" element={<AdminIndustriesPage />} />
                <Route path="quotes" element={<AdminQuotesPage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="media" element={<AdminMediaPage />} />
              </Route>

              {/* Global 404 Catch-All */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
