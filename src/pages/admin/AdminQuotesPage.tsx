import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api.js';
import { QuoteRequestItem } from '../../types.js';

export const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadQuotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getQuotes();
      setQuotes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quote requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      await api.updateQuote(id, { status: newStatus });
      setSuccessMsg('Quote status updated successfully.');
      await loadQuotes();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update quote status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete quote request from "${name}"?`)) {
      return;
    }

    try {
      await api.deleteQuote(id);
      setSuccessMsg('Quote request deleted successfully.');
      await loadQuotes();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete quote request.');
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.companyName && q.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.requiredService.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Request for Quotes (RFQs)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review detailed project specifications, required services, and budget estimations submitted by clients.
          </p>
        </div>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0A192F] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, email, company, service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Statuses ({quotes.length})</option>
            <option value="Pending">Pending</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Estimated">Estimated</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white dark:bg-[#0A192F] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            Loading quote requests...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No quote requests match the specified criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredQuotes.map(q => (
              <div key={q.id} className="p-5 space-y-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{q.name}</h3>
                    {q.companyName && (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500 dark:text-slate-400" /> {q.companyName}
                      </span>
                    )}
                    {q.industry && (
                      <span className="bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-medium px-2 py-0.5 rounded">
                        {q.industry}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={q.status}
                      onChange={e => handleStatusChange(q.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded border focus:outline-none ${
                        q.status === 'Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          : q.status === 'Estimated'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                          : q.status === 'Accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Estimated">Estimated</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>

                    <button
                      onClick={() => handleDelete(q.id, q.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                      title="Delete RFQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${q.email}`} className="hover:text-orange-600 dark:hover:text-orange-400 underline font-medium">
                      {q.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${q.phone}`} className="hover:text-orange-600 dark:hover:text-orange-400 font-medium">
                      {q.phone}
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#071324] p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">Required Service: <span className="text-orange-600 dark:text-orange-400">{q.requiredService}</span></span>
                    {q.estimatedBudget && (
                      <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Budget: {q.estimatedBudget}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    {q.projectDescription}
                  </p>
                </div>

                {q.createdAt && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Submitted on: {new Date(q.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
