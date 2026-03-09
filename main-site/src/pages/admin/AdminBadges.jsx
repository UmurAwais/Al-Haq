import React, { useState, useEffect } from 'react';
import { 
  BadgeCheck, 
  Search, 
  Trash2, 
  Plus, 
  Loader2, 
  Upload, 
  Award, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Star,
  Settings,
  X,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { apiFetch, getApiUrl } from '../../config';

const AdminBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    criteria: '',
    icon: null,
    iconPreview: null
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/badges', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setBadges(data.badges || []);
      }
    } catch (err) {
      console.error('Failed to fetch badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (badge = null) => {
    setError(null);
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        title: badge.title,
        description: badge.description || '',
        criteria: (badge.criteria || []).join('\n'),
        icon: null,
        iconPreview: badge.icon ? `${getApiUrl()}${badge.icon}` : null
      });
    } else {
      setEditingBadge(null);
      setFormData({
        title: '',
        description: '',
        criteria: '',
        icon: null,
        iconPreview: null
      });
    }
    setIsModalOpen(true);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, icon: file, iconPreview: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('criteria', JSON.stringify(formData.criteria.split('\n').filter(Boolean)));
    if (formData.icon) fd.append('icon', formData.icon);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingBadge ? `${getApiUrl()}/api/admin/badges/${editingBadge._id}` : `${getApiUrl()}/api/admin/badges`;
      const method = editingBadge ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-token': token
        },
        body: fd
      });

      const data = await response.json();
      if (data.ok) {
        setIsModalOpen(false);
        fetchBadges();
      } else {
        setError(data.message || 'Processing failed');
      }
    } catch (err) {
      setError('An error occurred during process.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement definitive?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/badges/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        fetchBadges();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredBadges = badges.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 text-nowrap">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <BadgeCheck className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Achievement Vault</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Star size={14} className="text-brand-accent" /> 
                Student Recognition System
            </p>
          </div>
        </div>

        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Forge Achievement
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH ACHIEVEMENTS..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-700 placeholder:text-slate-300 tracking-widest uppercase"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} /> Gamified Experience Active
                </span>
           </div>
        </div>

        {/* Badges Grid */}
        <div className="p-8">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Merit History...</p>
             </div>
          ) : filteredBadges.length === 0 ? (
             <div className="py-20 text-center text-slate-300">
                <BadgeCheck size={64} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tight">No Merit Found</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Create merit awards to reward students</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBadges.map((badge) => (
                  <div key={badge._id} className="group bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative text-center">
                     <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(badge)} className="p-2 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"><Settings size={16} /></button>
                        <button onClick={() => handleDelete(badge._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"><Trash2 size={16} /></button>
                     </div>

                     <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                        {badge.icon ? (
                           <img src={`${getApiUrl()}${badge.icon}`} alt="Icon" className="w-full h-full object-cover p-2" />
                        ) : (
                           <BadgeCheck size={40} className="text-brand opacity-20" />
                        )}
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>

                     <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-brand transition-colors text-nowrap truncate">{badge.title}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2 h-10 mb-6 px-4">{badge.description}</p>
                     
                     <div className="flex flex-wrap gap-1.5 justify-center">
                        <span className="px-3 py-1 bg-brand text-white rounded-lg text-[8px] font-black uppercase tracking-tighter">
                           Rare Merit
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
             {/* Modal Header */}
             <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingBadge ? 'Edit merit badge' : 'Create merit badge'}</h2>
                   <p className="text-xs text-slate-500 font-medium">Configure achievement standards for students</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={20} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form id="badgeForm" onSubmit={handleSubmit} className="space-y-8">
                   {error && (
                       <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                           <AlertCircle size={16} /> {error}
                       </div>
                   )}

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                       <div className="sm:col-span-1 space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Icon</label>
                          <div 
                             onClick={() => document.getElementById('iconFile').click()}
                             className={`w-full aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${formData.iconPreview ? 'border-brand/20 bg-brand/5' : 'border-slate-100 bg-slate-50 hover:border-brand/20 hover:bg-brand/5'}`}
                          >
                             <input id="iconFile" type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
                             {formData.iconPreview ? (
                                <img src={formData.iconPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                             ) : (
                                <Upload size={24} className="text-slate-300" />
                             )}
                          </div>
                       </div>

                      <div className="sm:col-span-2 space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Title</label>
                             <input 
                                 required 
                                 type="text" 
                                 value={formData.title} 
                                 onChange={e => setFormData({...formData, title: e.target.value.toUpperCase()})}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 outline-none uppercase tracking-widest focus:bg-white focus:border-brand/20 transition-all font-mono" 
                                 placeholder="E.G. TOP STUDENT" 
                             />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Narrative Description</label>
                             <textarea 
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-brand/20 transition-all resize-none"
                                placeholder="Describe this merit badge..."
                             ></textarea>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Verification Criteria (1 Per Line)</label>
                       <textarea 
                          rows="4"
                          value={formData.criteria}
                          onChange={e => setFormData({...formData, criteria: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-300 resize-none uppercase" 
                          placeholder="COMPLETE ALL LECTURES&#10;PASS FINAL EXAM&#10;SUBMIT ASSIGNMENT" 
                       ></textarea>
                   </div>
                </form>
             </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsModalOpen(false)} type="button" className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-200 transition-all">Discard</button>
                <button 
                   disabled={processing} 
                   form="badgeForm" 
                   type="submit" 
                   className="flex items-center gap-2 px-8 py-2.5 bg-brand hover:opacity-90 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand/10 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {processing ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />} 
                  {processing ? 'Processing...' : (editingBadge ? 'Save badge' : 'Issue badge')}
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBadges;
