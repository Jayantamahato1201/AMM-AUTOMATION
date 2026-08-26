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
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState<string>('New');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = async () => {
    try {
      const data = await api.getInquiries();
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
    setNotesInput(enq.notes || enq.adminNotes || '');
    setStatusInput(enq.status || 'New');
    setFeedback(null);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    setFeedback(null);

    try {
      const updated = await api.updateInquiry(selectedEnquiry.id, {
        status: statusInput,
        adminNotes: notesInput,
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

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setIsDeleting(true);

    try {
      await api.deleteInquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      setEnquiries(prev => prev.filter(e => e.id !== id));
      setDeleteTarget(null);
      await loadEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete enquiry.' });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const serviceName = enq.service || enq.serviceInterest || '';
    const matchSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.companyName && enq.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || enq.status.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Inbound Contact Inquiries</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review inbound requests submitted across solutions, contact form, and engineering consultations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-semibold px-3 py-1.5 rounded border border-orange-200 dark:border-orange-800">
            {enquiries.filter(e => e.status?.toLowerCase() === 'new').length} New / Unhandled
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0A192F] p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs transition-colors duration-300">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email, or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'New', 'Contacted', 'In Discussion', 'Closed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
        <div className="lg:col-span-7 bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">Loading customer enquiries...</div>
          ) : filteredEnquiries.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[650px] overflow-y-auto">
              {filteredEnquiries.map(enq => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const formattedDate = enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'Recent';

                return (
                  <div
                    key={enq.id}
                    onClick={() => openDetails(enq)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-orange-50/80 dark:bg-slate-800/80 border-l-4 border-orange-500'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <span>{enq.name}</span>
                          {enq.companyName && (
                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                              ({enq.companyName})
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {enq.email} • {enq.phone}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.status?.toLowerCase() === 'new'
                              ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                              : enq.status?.toLowerCase() === 'contacted'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : enq.status?.toLowerCase() === 'in discussion'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {enq.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{formattedDate}</div>
                      </div>
                    </div>

                    <div className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      "{enq.message}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                        {enq.service || enq.serviceInterest || 'General Solution'}
                      </span>
                      {enq.adminNotes && (
                        <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1 font-medium">
                          <MessageSquare className="w-3 h-3" /> Notes Added
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs">No customer enquiries match your active filter.</p>
            </div>
          )}
        </div>

        {/* Enquiry Detail Drawer */}
        <div className="lg:col-span-5">
          {selectedEnquiry ? (
            <div className="bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-300">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Enquiry File #{selectedEnquiry.id.slice(0, 8)}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedEnquiry.name}</h3>
                  {selectedEnquiry.companyName && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedEnquiry.companyName}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteClick(selectedEnquiry.id, selectedEnquiry.name)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Communication Channels */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="p-3 bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="truncate">{selectedEnquiry.phone}</span>
                </a>

                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span className="truncate">{selectedEnquiry.email}</span>
                </a>
              </div>

              {/* Technical Requirement Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Customer Requirement / Scope:
                </label>
                <div className="bg-slate-50 dark:bg-[#071324] p-4 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Workflow Status & Internal Notes */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Internal Engineering Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notesInput}
                    onChange={e => setNotesInput(e.target.value)}
                    placeholder="Log quotation estimates, site inspection dates, or team remarks..."
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-3 rounded text-xs flex items-center gap-2 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving Updates...' : 'Save Status & Notes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#0A192F]/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              Select an enquiry from the list to view specifications, reply, or update records.
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Inbound Enquiry"
        message={`Are you sure you want to permanently delete the inquiry record from "${deleteTarget?.name}"?`}
        confirmLabel="Delete Enquiry"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
};
