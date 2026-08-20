import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Cpu,
  Factory,
  Handshake,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api.js';
import { EnquiryItem, QuoteRequestItem } from '../../types.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryItem[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [statsData, enquiriesData, quotesData] = await Promise.all([
        api.getStats(),
        api.getInquiries().catch(() => []),
        api.getQuotes().catch(() => [])
      ]);
      setStats(statsData);
      setRecentEnquiries(enquiriesData.slice(0, 5));
      setRecentQuotes(quotesData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleEnquiryStatusChange = async (enquiryId: string, newStatus: any) => {
    try {
      await api.updateInquiry(enquiryId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    }
  };

  const handleQuoteStatusChange = async (quoteId: string, newStatus: any) => {
    try {
      await api.updateQuote(quoteId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update quote status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        Loading real-time operational metrics from database...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl transition-colors duration-300">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-colors duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AMM Automation Master Control Panel</h1>
            <span className="text-[10px] bg-orange-600 text-white font-semibold uppercase px-2 py-0.5 rounded">
              Online
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Manage partner companies, engineering services, industry applications, client inquiries, quote requests, and site copywriting dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/quotes"
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Review Quotes ({stats?.pendingQuoteRequests || 0} Pending)</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold px-4 py-2 rounded border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inquiries ({stats?.newInquiries || stats?.newEnquiries || 0} New)</span>
          </Link>
        </div>
      </div>

      {/* 4 Real Data Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Partner Companies */}
        <div className="bg-white dark:bg-[#0A192F] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-300">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Partner Companies
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalPartnerCompanies ?? stats?.activePartners ?? 1}
            </div>
            <span className="text-[11px] text-[#0A192F] dark:text-blue-300 font-semibold">
              Strategic collaborations
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
            <Handshake className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Services */}
        <div className="bg-white dark:bg-[#0A192F] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-300">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Core Services
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalServices || 10}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {stats?.activeServices || 10} active & published
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950/40 text-[#0A192F] dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#0A192F] dark:text-blue-400" />
          </div>
        </div>

        {/* Card 3: Industries */}
        <div className="bg-white dark:bg-[#0A192F] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-300">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Industries Served
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalIndustries || 9}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Sector domain profiles
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <Factory className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Quote Requests */}
        <div className="bg-white dark:bg-[#0A192F] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-300">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Quote RFQs
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalQuoteRequests || recentQuotes.length || 0}
            </div>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
              {stats?.pendingQuoteRequests || 0} pending review
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Quote Requests Table */}
      <div className="bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Request for Quotes (RFQs)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quotes requested by plant heads and engineering procurement</p>
          </div>
          <Link
            to="/admin/quotes"
            className="text-xs font-semibold text-[#0A192F] dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All RFQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentQuotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Client / Contact</th>
                  <th className="px-5 py-3">Company / Industry</th>
                  <th className="px-5 py-3">Required Service</th>
                  <th className="px-5 py-3">Estimated Budget</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentQuotes.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{q.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{q.phone} • {q.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{q.companyName || 'Not specified'}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{q.industry || 'General'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-blue-50 dark:bg-blue-950/50 text-[#0A192F] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-medium text-[11px]">
                        {q.requiredService}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {q.estimatedBudget || 'Not specified'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.status === 'Pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : q.status === 'Estimated'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                            : q.status === 'Accepted'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select
                        value={q.status}
                        onChange={(e) => handleQuoteStatusChange(q.id, e.target.value)}
                        className="text-[11px] bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded px-2 py-1 focus:outline-none focus:border-blue-900 dark:focus:border-orange-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Estimated">Estimated</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No quote requests logged yet.
          </div>
        )}
      </div>

      {/* Recent Contact Inquiries Table */}
      <div className="bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Contact Form Inquiries</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Direct inquiries received via contact page</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-[#0A192F] dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Client / Contact</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Service Interest</th>
                  <th className="px-5 py-3">Message Snippet</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{enq.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{enq.phone} • {enq.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-medium">{enq.companyName || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-blue-50 dark:bg-blue-950/50 text-[#0A192F] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-medium text-[11px]">
                        {enq.service || enq.serviceInterest || 'General Enquiry'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {enq.message}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'New'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                            : enq.status === 'Contacted'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <select
                        value={enq.status}
                        onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                        className="text-[11px] bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded px-2 py-1 focus:outline-none focus:border-blue-900 dark:focus:border-orange-500"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No customer inquiries logged yet.
          </div>
        )}
      </div>

      {/* Quick Access Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/partners"
          className="p-5 bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <Handshake className="w-6 h-6 text-[#0A192F] dark:text-blue-400 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Partner Companies</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage partner records dynamically, update Global Infosoft details, and add strategic alliances.</p>
        </Link>

        <Link
          to="/admin/services"
          className="p-5 bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-6 h-6 text-[#0A192F] dark:text-blue-400 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Manage Services</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Edit all 10 core offerings, pump & motor rewinding, instrumentation, and robotics.</p>
        </Link>

        <Link
          to="/admin/content"
          className="p-5 bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-[#0A192F] dark:text-blue-400 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Edit Website Content</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Update hero headlines, company description, contact numbers, and corporate notices.</p>
        </Link>
      </div>
    </div>
  );
};
