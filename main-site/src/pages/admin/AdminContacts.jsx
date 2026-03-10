import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  User, 
  Calendar, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  Eye,
  Phone
} from 'lucide-react';
import { apiFetch } from '../../config';
const AdminContacts = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // 1. Initial Fetch
    fetchSubmissions();

    // 2. Poll MongoDB in the background every 5 seconds (The "Immediate" Sync)
    // This allows "No reload required" updates using your primary MongoDB database.
    const pollInterval = setInterval(() => {
      syncSubmissions();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  // Soft Sync function for periodic updates
  const syncSubmissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/contacts', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok && data.contacts) {
        setSubmissions(data.contacts);
      }
    } catch (err) {
      console.log('Background sync temporarily paused...');
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/contacts', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions(data.contacts || []);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, submission) => {
    e.stopPropagation();
    setSubmissionToDelete(submission);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/contacts/${submissionToDelete._id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== submissionToDelete._id));
        setIsDeleteModalOpen(false);
        setIsModalOpen(false);
        setSubmissionToDelete(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Mail className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inquiry Inbox</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and respond to student inquiries ({submissions.length} messages)</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/10">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, email or subject..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} /> Live Sync Active
                </span>
           </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Message Vault...</p>
             </div>
          ) : filteredSubmissions.length === 0 ? (
             <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                    <Mail size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 uppercase tracking-tight mb-2">Inbox Empty</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No inquiry submissions found at this time</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sender</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excerpt</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredSubmissions.map((sub) => (
                      <tr key={sub._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => handleOpenDetails(sub)}>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center border border-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                                  <User size={18} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800 tracking-tight leading-tight group-hover:text-brand transition-colors">{sub.name}</p>
                                  <p className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5">
                                      {sub.email}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-tight border border-slate-200">
                                {sub.subject || 'GENERAL INQUIRY'}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <p className="text-xs font-bold text-slate-500 line-clamp-1 max-w-50">
                                {sub.message}
                            </p>
                         </td>
                         <td className="px-6 py-5 text-right">
                            <p className="text-xs font-bold text-slate-700 tracking-tighter mb-0.5">{formatDate(sub.createdAt).split(',')[0]}</p>
                            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{formatDate(sub.createdAt).split(',')[1]}</p>
                         </td>
                         <td className="px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-2xl transition-all shadow-sm border border-slate-100">
                                    <Eye size={18} />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteClick(e, sub)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm border border-slate-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
             {/* Modal Header */}
             <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inquiry details</h2>
                   <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">{selectedSubmission.subject || 'General inquiry'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-200">
                    <XCircle size={20} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="space-y-8">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                             <User size={12} className="text-brand" /> Sender
                         </p>
                         <p className="text-base font-bold text-slate-800 tracking-tight uppercase">{selectedSubmission.name}</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                             <Mail size={12} className="text-brand" /> Email
                         </p>
                         <p className="text-sm font-bold text-brand tracking-tight lowercase truncate">{selectedSubmission.email}</p>
                      </div>
                   </div>

                   {selectedSubmission.phone && (
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                              <Phone size={12} className="text-brand" /> WhatsApp / Phone
                          </p>
                          <p className="text-base font-bold text-slate-800 tracking-tight">{selectedSubmission.phone}</p>
                      </div>
                   )}

                   <div className="p-6 bg-brand/5 rounded-2xl border border-brand/5 relative">
                      <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-3">Message</p>
                      <div className="text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                          {selectedSubmission.message}
                      </div>
                   </div>

                   <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-4 border-t border-slate-100">
                      <span>Received: {formatDate(selectedSubmission.createdAt)}</span>
                      <span>ID: {selectedSubmission._id}</span>
                   </div>
                </div>
             </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button 
                   onClick={(e) => handleDeleteClick(e, selectedSubmission)}
                   disabled={deleting}
                   className="px-5 py-2.5 rounded-2xl font-bold text-xs text-red-500 hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete message'}
                </button>
                <a 
                   href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'Inquiry from Al-Haq'}`}
                   className="flex items-center gap-2 px-8 py-2.5 bg-brand hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Mail size={16} /> Reply via email
                </a>
              </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60" onClick={() => !deleting && setIsDeleteModalOpen(false)}></div>
           <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-sm">
                 <Trash2 size={40} className="animate-bounce" />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight uppercase tracking-tight">Erase Submission?</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                 You are about to permanently delete <span className="text-red-500 font-bold">{submissionToDelete?.name}'s</span> inquiry. This action cannot be reversed.
              </p>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={confirmDelete}
                   disabled={deleting}
                   className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>Confirm Removal</>
                    )}
                 </button>
                 <button 
                   onClick={() => setIsDeleteModalOpen(false)}
                   disabled={deleting}
                   className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                 >
                    Nevermind
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
