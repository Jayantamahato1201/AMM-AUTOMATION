import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
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
import { PortfolioPage } from './pages/PortfolioPage.js';
import { ProjectDetailPage } from './pages/ProjectDetailPage.js';
import { ContactPage } from './pages/ContactPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.js';
import { AdminIndustriesPage } from './pages/admin/AdminIndustriesPage.js';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage.js';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage.js';
import { AdminContentPage } from './pages/admin/AdminContentPage.js';

// Public Website Layout Wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
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
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-4xl font-extrabold text-blue-900 font-mono">404</div>
        <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-600">
          The requested page does not exist or has been moved within our engineering directory.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          Return to AMM Automation Home
        </Link>
      </div>
    </div>
  );
};

export function App() {
  return (
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
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Standalone Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Control Center */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="industries" element={<AdminIndustriesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="content" element={<AdminContentPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
