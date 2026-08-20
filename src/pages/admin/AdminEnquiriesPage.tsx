import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Trash2,
  Phone,
  Mail,
  Building,
  Calendar,
  Save,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api.js';
import { EnquiryItem } from '../../types.js';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState<'New' | 'Contacted' | 'In Discussion' | 'Closed'>('New');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('Error loading enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const openDetails = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
    setNotesInput(enq.notes || '');
    setStatusInput(enq.status);
    setFeedback(null);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    setFeedback(null);

    try {
      const updated = await api.updateEnquiry(selectedEnquiry.id, {
        status: statusInput,
        notes: notesInput
      });
      setSelectedEnquiry(updated);
      setFeedback({ type: 'success', message: 'Status and notes updated successfully!' });
      loadEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update record.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry submission from "${name}"?`)) return;

    try {
      await api.deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      loadEnquiries();
    } catch (err) {
      alert('Failed to delete enquiry');
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.companyName && enq.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enq.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || enq.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Enquiries & Quotation RFQs</h1>
          <p className="text-xs text-slate-500">
            Review inbound requests submitted across solutions, contact form, and quick quotation popups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-3 py-1.5 rounded border border-orange-200">
            {enquiries.filter(e => e.status === 'New').length} New / Unhandled
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['All', 'New', 'Contacted', 'In Discussion', 'Closed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-blue-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading customer enquiries...</div>
          ) : filteredEnquiries.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
              {filteredEnquiries.map(enq => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const formattedDate = new Date(enq.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={enq.id}
                    onClick={() => openDetails(enq)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-orange-500'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{enq.name}</span>
                          {enq.companyName && (
                            <span className="text-xs font-normal text-slate-500">
                              ({enq.companyName})
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {enq.email} • {enq.phone}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.status === 'New'
                              ? 'bg-red-100 text-red-700'
                              : enq.status === 'Contacted'
                              ? 'bg-amber-100 text-amber-700'
                              : enq.status === 'In Discussion'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{formattedDate}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded text-slate-700 font-medium">
                      <span className="text-orange-600 font-semibold mr-1">[{enq.service}]:</span>
                      <span>{enq.subject || enq.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-800 text-sm">No enquiries found</p>
              <p className="text-slate-400 text-xs">No customer inquiries match the current filter.</p>
            </div>
          )}
        </div>

        {/* Detail & Response Pane */}
        <div className="lg:col-span-5">
          {selectedEnquiry ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5 sticky top-20 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                    RFQ Details
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedEnquiry.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(selectedEnquiry.id, selectedEnquiry.name)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {feedback && (
                <div
                  className={`p-2.5 rounded text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded text-slate-800 flex items-center justify-center gap-1.5 font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  <span>Call {selectedEnquiry.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(
                    selectedEnquiry.subject || 'AMM Automation Enquiry'
                  )}`}
                  className="bg-slate-100 hover:bg-slate-200 p-2.5 rounded text-slate-800 flex items-center justify-center gap-1.5 font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  <span>Send Email</span>
                </a>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200">
                {selectedEnquiry.companyName && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Company</span>
                    <span className="font-semibold text-slate-900">{selectedEnquiry.companyName}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Selected</span>
                  <span className="font-semibold text-blue-900">{selectedEnquiry.service}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Message / Specs</span>
                  <p className="text-slate-800 mt-1 whitespace-pre-wrap leading-relaxed">
                    {selectedEnquiry.message}
                  </p>
                </div>
              </div>

              {/* Update Status & Internal Notes */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Update Processing Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-semibold focus:outline-none focus:border-blue-900"
                  >
                    <option value="New">New (Pending First Contact)</option>
                    <option value="Contacted">Contacted (Called / Emailed)</option>
                    <option value="In Discussion">In Discussion (Quotation Sent)</option>
                    <option value="Closed">Closed (Order Finalized / Archived)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Internal Engineering / Sales Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={e => setNotesInput(e.target.value)}
                    placeholder="Log quote numbers, motor model discussed, visit schedule..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2 rounded shadow flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Save Status & Notes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
              Select an enquiry from the list to inspect client details, dispatch responses, and log internal sales notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
