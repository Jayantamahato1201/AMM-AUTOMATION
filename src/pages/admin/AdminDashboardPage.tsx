import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Cpu,
  Factory,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from '../../services/api.js';
import { EnquiryItem } from '../../types.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalServices: number;
    activeServices: number;
    totalIndustries: number;
    activeIndustries: number;
    totalProjects: number;
    totalEnquiries: number;
    newEnquiries: number;
  } | null>(null);

  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [statsData, enquiriesData] = await Promise.all([
        api.getStats(),
        api.getEnquiries()
      ]);
      setStats(statsData);
      setRecentEnquiries(enquiriesData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusChange = async (enquiryId: string, newStatus: any) => {
    try {
      await api.updateEnquiry(enquiryId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16 text-slate-500 text-sm">
        Loading real-time operational metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="bg-[#0A192F] text-white p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">AMM Automation Master Control Panel</h1>
            <span className="text-[10px] bg-orange-600 text-white font-semibold uppercase px-2 py-0.5 rounded">
              Online
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Manage services, industry applications, project case studies, client RFQs, and homepage content dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/enquiries"
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors inline-flex items-center gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Review Enquiries ({stats?.newEnquiries || 0} New)</span>
          </Link>
        </div>
      </div>

      {/* 4 Real Data Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Enquiries */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Client RFQs
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalEnquiries || 0}
            </div>
            <span className="text-[11px] text-orange-600 font-semibold">
              {stats?.newEnquiries || 0} pending response
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Services */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Key Offerings
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalServices || 0}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {stats?.activeServices || 0} published
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-blue-900" />
          </div>
        </div>

        {/* Card 3: Industries */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Industries Served
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalIndustries || 0}
            </div>
            <span className="text-[11px] text-slate-500">
              Sector domain guides
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
            <Factory className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Projects */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Portfolio Projects
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalProjects || 0}
            </div>
            <span className="text-[11px] text-blue-600 font-semibold">
              Verified case studies
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Inquiries & RFQ Submissions</h3>
            <p className="text-xs text-slate-500">Submissions received via website contact forms</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-blue-900 hover:text-orange-600 inline-flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Client / Contact</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Service Interest</th>
                  <th className="px-5 py-3">Message Snippet</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{enq.name}</div>
                      <div className="text-slate-500 text-[11px]">{enq.phone} • {enq.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{enq.companyName || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-medium text-[11px]">
                        {enq.service}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {enq.message}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'New'
                            ? 'bg-red-100 text-red-700'
                            : enq.status === 'Contacted'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className="text-[11px] bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-900"
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
          <div className="p-8 text-center text-slate-500 text-xs">
            No customer inquiries logged yet.
          </div>
        )}
      </div>

      {/* Quick Access Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/services"
          className="p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-6 h-6 text-blue-900 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Manage Services</h4>
          <p className="text-xs text-slate-500 mt-1">Edit all 10 core offerings, pump & motor rewinding, instrumentation, and robotics.</p>
        </Link>

        <Link
          to="/admin/projects"
          className="p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-6 h-6 text-blue-900 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Manage Projects & Portfolio</h4>
          <p className="text-xs text-slate-500 mt-1">Add plant retrofits, upload site gallery images, and configure client case studies.</p>
        </Link>

        <Link
          to="/admin/content"
          className="p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all block group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-blue-900 group-hover:text-orange-600 transition-colors" />
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Edit Website Content</h4>
          <p className="text-xs text-slate-500 mt-1">Update hero headlines, company description, contact numbers, and corporate notices.</p>
        </Link>
      </div>
    </div>
  );
};
