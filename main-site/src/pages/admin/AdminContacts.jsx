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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== id));
        setIsModalOpen(false);
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
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Mail className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inquiry Inbox</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Clock size={14} className="text-brand-accent" /> 
                {submissions.length} Messages Received
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH BY NAME, EMAIL OR SUBJECT..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-700 placeholder:text-slate-300 tracking-widest uppercase"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} /> Syncing with CRM
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
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight mb-2">Inbox Empty</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No inquiry submissions found at this time</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sender</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Excerpt</th>
                      <th className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                      <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredSubmissions.map((sub) => (
                      <tr key={sub._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => handleOpenDetails(sub)}>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center border border-brand/10 text-brand">
                                  <User size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 tracking-tight leading-tight mb-0.5 group-hover:text-brand transition-colors uppercase">{sub.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                      {sub.email}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight border border-slate-200">
                                {sub.subject || 'GENERAL INQUIRY'}
                            </span>
                         </td>
                         <td className="px-6 py-6">
                            <p className="text-xs font-bold text-slate-500 line-clamp-1 max-w-50">
                                {sub.message}
                            </p>
                         </td>
                         <td className="px-6 py-6 text-right">
                            <p className="text-xs font-black text-slate-700 tracking-tighter mb-0.5">{formatDate(sub.createdAt).split(',')[0]}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(sub.createdAt).split(',')[1]}</p>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                                    <Eye size={18} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(sub._id); }}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-200">
             {/* Modal Header */}
             <div className="shrink-0 p-8 sm:px-10 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{selectedSubmission.subject || 'INQUIRY DETAIL'}</span>
                        <div className="h-px w-8 bg-brand/30"></div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Message View</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="relative z-10 w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={24} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
                <div className="space-y-10">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <User size={12} className="text-brand" /> Sender Name
                         </p>
                         <p className="text-lg font-black text-slate-800 tracking-tight uppercase">{selectedSubmission.name}</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Mail size={12} className="text-brand" /> Email Address
                         </p>
                         <p className="text-sm font-black text-brand tracking-tight lowercase">{selectedSubmission.email}</p>
                      </div>
                   </div>

                   {selectedSubmission.phone && (
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Phone size={12} className="text-brand" /> WhatsApp / Phone
                          </p>
                          <p className="text-lg font-black text-slate-800 tracking-tight">{selectedSubmission.phone}</p>
                      </div>
                   )}

                   <div className="p-8 bg-brand/5 rounded-3xl border border-brand/5 relative">
                      <div className="absolute top-4 right-4 text-brand opacity-10">
                         <MessageSquare size={64} />
                      </div>
                      <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-4">Message Content</p>
                      <div className="text-slate-700 text-sm font-bold leading-relaxed whitespace-pre-wrap">
                          {selectedSubmission.message}
                      </div>
                   </div>

                   <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 py-4 border-t border-slate-100">
                      <span>Received: {formatDate(selectedSubmission.createdAt)}</span>
                      <span>ID: {selectedSubmission._id}</span>
                   </div>
                </div>
             </div>

             {/* Modal Footer */}
             <div className="shrink-0 p-8 sm:px-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
               <button 
                  onClick={() => handleDelete(selectedSubmission._id)}
                  disabled={deleting}
                  className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-500 hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-red-100 hover:border-red-500 shadow-sm disabled:opacity-50"
               >
                 {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                 Delete Forever
               </button>
               <a 
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'Inquiry from Al-Haq'}`}
                  className="flex items-center gap-3 px-10 py-4 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
               >
                 <Mail size={16} /> Reply via Email
               </a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
