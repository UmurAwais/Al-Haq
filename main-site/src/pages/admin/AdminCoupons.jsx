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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error('Delete error:', err);
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
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Ticket className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Discount Engine</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Activity size={14} className="text-brand-accent" /> 
                {coupons.length} Active Campaigns
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Create Coupon
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH BY COUPON CODE OR LABEL..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-700 placeholder:text-slate-300 tracking-widest uppercase"
              />
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Real-time Updates Enabled
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
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight mb-2">No Coupons Found</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create your first discount campaign to get started</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campaign Code</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Discount</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usage Track</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expiry</th>
                      <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredCoupons.map((coupon) => (
                      <tr key={coupon._id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center border border-brand/10 text-brand">
                                  <Tag size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 tracking-tight leading-tight mb-0.5 group-hover:text-brand transition-colors uppercase">{coupon.code}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                      {coupon.label}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                               {coupon.type === 'percent' ? (
                                   <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-black text-xs border border-emerald-100 uppercase tracking-tight flex items-center gap-1">
                                      <Percent size={12} /> {coupon.value}% OFF
                                   </span>
                               ) : (
                                   <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-black text-xs border border-blue-100 uppercase tracking-tight flex items-center gap-1">
                                      <Banknote size={12} /> Rs.{coupon.value} OFF
                                   </span>
                               )}
                            </div>
                            {coupon.minPurchaseAmount > 0 && (
                                <p className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">
                                    Min: Rs. {coupon.minPurchaseAmount}
                                </p>
                            )}
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex flex-col gap-1.5 w-32">
                                <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                    <span>Redeemed</span>
                                    <span>{coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : coupon.usedCount}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
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
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Never Expires</span>
                            )}
                         </td>
                         <td className="px-6 py-6 text-center">
                            <button 
                                onClick={() => toggleStatus(coupon)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
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
                                    onClick={() => handleDelete(coupon._id)}
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-200">
             {/* Modal Header */}
             <div className="shrink-0 p-8 sm:px-10 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{editingCoupon ? 'Configuration Mode' : 'Campaign Studio'}</span>
                        <div className="h-px w-8 bg-brand/30"></div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{editingCoupon ? 'Update Coupon' : 'New Coupon'}</h2>
                </div>
                <button onClick={closeModal} className="relative z-10 w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={24} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
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
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Unique Code</label>
                            <div className="relative group">
                                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest" 
                                    placeholder="FREE2026" 
                                />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Friendly Label</label>
                            <input 
                                required 
                                type="text" 
                                value={formData.label} 
                                onChange={e => setFormData({...formData, label: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase" 
                                placeholder="E.G. NEW YEAR DISCOUNT" 
                            />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                            <textarea 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 min-h-25" 
                                placeholder="DETAILS ABOUT THIS PROMOTION..." 
                            />
                         </div>
                      </div>

                      {/* Right Side */}
                      <div className="space-y-6">
                         <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                >
                                   <option value="percent">Percentage (%)</option>
                                   <option value="fixed">Fixed Price (Rs)</option>
                                </select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Value</label>
                                <input 
                                    required 
                                    type="number" 
                                    value={formData.value} 
                                    onChange={e => setFormData({...formData, value: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all placeholder:text-slate-300" 
                                    placeholder="10" 
                                />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expiration Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={formData.expiryDate} 
                                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 outline-none transition-all cursor-pointer" 
                                />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Min. Entry</label>
                                <input 
                                    type="number" 
                                    value={formData.minPurchaseAmount} 
                                    onChange={e => setFormData({...formData, minPurchaseAmount: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-700 outline-none focus:bg-white focus:border-brand/20 placeholder:text-slate-300" 
                                    placeholder="0" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Max Limit</label>
                                <input 
                                    type="number" 
                                    value={formData.usageLimit} 
                                    onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-700 outline-none focus:bg-white focus:border-brand/20 placeholder:text-slate-300" 
                                    placeholder="UNLIMITED" 
                                />
                            </div>
                         </div>

                         <div className="pt-2 flex items-center justify-between p-6 bg-slate-50 rounded-[22px] border border-slate-100">
                             <div>
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Active Status</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Allow users to redeem</p>
                             </div>
                             <div 
                                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 border-2 ${formData.isActive ? 'bg-brand border-brand' : 'bg-slate-200 border-slate-300'}`}
                             >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                             </div>
                         </div>
                      </div>
                   </div>
                </form>
             </div>

             {/* Modal Footer */}
             <div className="shrink-0 p-8 sm:px-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
               <button onClick={closeModal} type="button" className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-all">Discard</button>
               <button 
                  disabled={saving} 
                  form="couponForm" 
                  type="submit" 
                  className="flex items-center gap-3 px-10 py-4 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70"
               >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings2 size={16} />} 
                 {saving ? 'Processing...' : (editingCoupon ? 'Finalize Changes' : 'Launch Campaign')}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
