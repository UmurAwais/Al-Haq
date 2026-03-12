import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Tag, 
  Hash, 
  Percent,
  Banknote,
  AlertCircle,
  Clock,
  ChevronRight,
  Loader2,
  Settings2,
  Eye,
  ToggleLeft as Toggle,
  Activity
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDeleteCoupon, setConfirmDeleteCoupon] = useState(null); // For delete modal

  const [formData, setFormData] = useState({
    code: '',
    label: '',
    description: '',
    type: 'percent',
    value: '',
    expiryDate: '',
    minPurchaseAmount: 0,
    usageLimit: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/coupons', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        label: coupon.label,
        description: coupon.description || '',
        type: coupon.type,
        value: coupon.value,
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
        minPurchaseAmount: coupon.minPurchaseAmount || 0,
        usageLimit: coupon.usageLimit || '',
        isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        label: '',
        description: '',
        type: 'percent',
        value: '',
        expiryDate: '',
        minPurchaseAmount: 0,
        usageLimit: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const dataToSend = { ...formData };
    if (!dataToSend.expiryDate) delete dataToSend.expiryDate;
    if (dataToSend.usageLimit === '') dataToSend.usageLimit = null;

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon._id}` 
        : '/api/admin/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await res.json();
      if (data.ok) {
        fetchCoupons();
        closeModal();
      } else {
        setError(data.message || 'Failed to save coupon');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred while saving the coupon.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteCoupon) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/coupons/${confirmDeleteCoupon._id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        fetchCoupons();
        setConfirmDeleteCoupon(null);
      } else {
        setError(data.message || 'Failed to delete coupon');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Connection failure during registry purge.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (coupon) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });
      const data = await res.json();
      if (data.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Ticket className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Discount Engine</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and monitor your active coupon campaigns ({coupons.length} campaigns)</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/10 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Create Coupon
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/10">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search by code or label..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-white transition-all text-slate-600 placeholder:text-slate-300"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Live Inventory Sync
                </span>
           </div>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Active Coupons...</p>
             </div>
          ) : filteredCoupons.length === 0 ? (
             <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                    <Ticket size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 uppercase tracking-tight mb-2">No Coupons Found</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create your first discount campaign to get started</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Code</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discount</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usage Track</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry</th>
                      <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredCoupons.map((coupon) => (
                      <tr key={coupon._id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center border border-brand/10 text-brand">
                                  <Tag size={18} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-800 tracking-tight leading-tight group-hover:text-brand transition-colors uppercase">{coupon.code}</p>
                                  <p className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5">
                                      {coupon.label}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               {coupon.type === 'percent' ? (
                                   <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100 uppercase tracking-tight flex items-center gap-1">
                                      <Percent size={12} /> {coupon.value}% OFF
                                   </span>
                               ) : (
                                   <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs border border-blue-100 uppercase tracking-tight flex items-center gap-1">
                                      <Banknote size={12} /> Rs.{coupon.value} OFF
                                   </span>
                               )}
                            </div>
                            {coupon.minPurchaseAmount > 0 && (
                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium tracking-tight">
                                    Min purchase: Rs. {coupon.minPurchaseAmount}
                                </p>
                            )}
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex flex-col gap-1.5 w-32">
                                <div className="flex justify-between text-[10px] font-medium text-slate-500 tracking-tight">
                                    <span>Used</span>
                                    <span>{coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : coupon.usedCount}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                    <div 
                                        className="h-full bg-brand rounded-full transition-all duration-1000"
                                        style={{ width: `${coupon.usageLimit ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : (coupon.usedCount > 0 ? 10 : 0)}%` }}
                                    ></div>
                                </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            {coupon.expiryDate ? (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold tracking-tight">
                                        {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Never Expires</span>
                            )}
                         </td>
                         <td className="px-6 py-6 text-center">
                            <button 
                                onClick={() => toggleStatus(coupon)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest transition-all ${
                                    coupon.isActive 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                                }`}
                            >
                               {coupon.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                               {coupon.isActive ? 'Active' : 'Disabled'}
                            </button>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <button 
                                    onClick={() => handleOpenModal(coupon)}
                                    className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 group/btn"
                                >
                                    <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                                 <button 
                                     onClick={() => setConfirmDeleteCoupon(coupon)}
                                     className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 group/btn"
                                 >
                                     <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                 </button>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                                    <MoreVertical size={16} />
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

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[95vh]">
             {/* Modal Header */}
             <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingCoupon ? 'Update coupon' : 'Create new coupon'}</h2>
                    <p className="text-xs text-slate-500 font-medium">{editingCoupon ? 'Modify campaign parameters' : 'Launch new discount campaign'}</p>
                </div>
                <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={20} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <form id="couponForm" onSubmit={handleSubmit} className="space-y-8">
                   {error && (
                       <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                           <AlertCircle size={16} /> {error}
                       </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Side */}
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unique Code</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest" 
                                    placeholder="FREE2026" 
                                />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Friendly Label</label>
                            <input 
                                required 
                                type="text" 
                                value={formData.label} 
                                onChange={e => setFormData({...formData, label: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-300" 
                                placeholder="E.G. NEW YEAR DISCOUNT" 
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-200 min-h-24 resize-none" 
                                placeholder="PROMOTION DETAILS..." 
                            />
                         </div>
                      </div>

                      {/* Right Side */}
                      <div className="space-y-6">
                         <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all appearance-none cursor-pointer"
                                >
                                   <option value="percent">Percentage (%)</option>
                                   <option value="fixed">Fixed Price (Rs)</option>
                                </select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Value</label>
                                <input 
                                    required 
                                    type="number" 
                                    value={formData.value} 
                                    onChange={e => setFormData({...formData, value: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all" 
                                    placeholder="10" 
                                />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Expiration Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={formData.expiryDate} 
                                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all cursor-pointer" 
                                />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Min. Purchase</label>
                                <input 
                                    type="number" 
                                    value={formData.minPurchaseAmount} 
                                    onChange={e => setFormData({...formData, minPurchaseAmount: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-brand/20 placeholder:text-slate-300" 
                                    placeholder="0" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Max Uses</label>
                                <input 
                                    type="number" 
                                    value={formData.usageLimit} 
                                    onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-brand/20 placeholder:text-slate-300" 
                                    placeholder="UNLIMITED" 
                                />
                            </div>
                         </div>

                         <div className="pt-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Active Status</h4>
                                <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">Control coupon redemption availability</p>
                             </div>
                             <div 
                                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-all duration-300 ${formData.isActive ? 'bg-brand' : 'bg-slate-200'}`}
                             >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                             </div>
                         </div>
                      </div>
                   </div>
                </form>
             </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button onClick={closeModal} type="button" className="px-5 py-2.5 rounded-2xl font-bold text-xs text-slate-500 hover:bg-slate-200 transition-all">Discard</button>
                <button 
                   disabled={saving} 
                   form="couponForm" 
                   type="submit" 
                   className="flex items-center gap-2 px-8 py-2.5 bg-brand hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings2 size={16} />} 
                  {saving ? 'Processing...' : (editingCoupon ? 'Save Changes' : 'Launch Campaign')}
                </button>
              </div>
          </div>
        </div>
      )}
      
      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteCoupon && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setConfirmDeleteCoupon(null)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[30px] flex items-center justify-center mx-auto mb-6 border-2 border-red-100 shadow-sm animate-bounce">
                    <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">Delete Coupon?</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose mb-8 px-4">
                    You are about to permanently remove campaign <span className="text-red-500 font-extrabold">{confirmDeleteCoupon.code}</span>. This action is irreversible.
                </p>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleConfirmDelete}
                        disabled={saving}
                        className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? 'Terminating Registry...' : 'Confirm Deletion'}
                    </button>
                    <button 
                        onClick={() => setConfirmDeleteCoupon(null)}
                        className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
