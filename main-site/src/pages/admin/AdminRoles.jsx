import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Trash2, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Loader2, 
  Settings2, 
  Edit, 
  Lock, 
  Eye, 
  CheckSquare, 
  Square,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  const availablePermissions = [
    'VIEW_COURSES', 'MANAGE_COURSES',
    'VIEW_ORDERS', 'MANAGE_ORDERS',
    'VIEW_USERS', 'MANAGE_USERS',
    'VIEW_COUPONS', 'MANAGE_COUPONS',
    'VIEW_ROLES', 'MANAGE_ROLES'
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/roles', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setRoles(data.roles || []);
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (perm) => {
    setFormData(prev => {
      const perms = [...prev.permissions];
      if (perms.includes(perm)) {
        return { ...prev, permissions: perms.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...perms, perm] };
      }
    });
  };

  const openModal = (role = null) => {
    setError(null);
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: role.permissions || []
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        permissions: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingRole ? `/api/admin/roles/${editingRole._id}` : '/api/admin/roles';
      const method = editingRole ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.ok) {
        fetchRoles();
        setIsModalOpen(false);
      } else {
        setError(data.message || 'Failed to save role');
      }
    } catch (err) {
      setError('An error occurred while saving the role.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this role definitively?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch(`/api/admin/roles/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        fetchRoles();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Access Control</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Lock size={14} className="text-brand-accent" /> 
                {roles.length} Custom Logic Roles
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Create New Role
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Configured Authorization Sets</h3>
           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert size={12} /> SuperAdmin Override Enabled
                </span>
           </div>
        </div>

        {/* Roles Grid */}
        <div className="p-8">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Permission Schema...</p>
             </div>
          ) : roles.length === 0 ? (
             <div className="py-32 text-center text-slate-300">
                <ShieldCheck size={64} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tight">No Custom Roles Found</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add a role to begin delegation</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div 
                    key={role._id} 
                    className="group bg-slate-50 border border-slate-100 rounded-[35px] p-8 hover:bg-white hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden active:scale-95"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     
                     <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                           <ShieldCheck size={24} />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openModal(role)} className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100"><Edit size={16} /></button>
                           <button onClick={() => handleDelete(role._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100"><Trash2 size={16} /></button>
                        </div>
                     </div>

                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-brand transition-colors text-nowrap truncate">{role.name}</h3>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">{role.permissions.length} PERVISIONS ASSIGNED</p>

                     <div className="flex flex-wrap gap-1.5 h-16 overflow-hidden">
                        {role.permissions.slice(0, 4).map(p => (
                           <span key={p} className="px-2 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-tight">
                              {p.split('_')[1]}
                           </span>
                        ))}
                        {role.permissions.length > 4 && (
                           <span className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black">+{role.permissions.length - 4} MORE</span>
                        )}
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-200 max-h-[90vh]">
             {/* Modal Header */}
             <div className="shrink-0 p-8 sm:px-10 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{editingRole ? 'Update Profile' : 'Schema Builder'}</span>
                        <div className="h-px w-8 bg-brand/30"></div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{editingRole ? 'Edit Role' : 'Create Role'}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="relative z-10 w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-100">
                    <XCircle size={24} />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
                <form id="roleForm" onSubmit={handleSubmit} className="space-y-10">
                   {error && (
                       <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                           <AlertCircle size={16} /> {error}
                       </div>
                   )}

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Role Identifier (Name)</label>
                      <input 
                          required 
                          type="text" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-8 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest" 
                          placeholder="E.G. MODERATOR" 
                      />
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Permissions Matrix</label>
                         <span className="text-[10px] font-black text-brand uppercase tracking-widest">{formData.permissions.length} Selected</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {availablePermissions.map(perm => (
                            <div 
                               key={perm} 
                               onClick={() => handleTogglePermission(perm)}
                               className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-center justify-between group ${formData.permissions.includes(perm) ? 'bg-brand/5 border-brand/20 ring-1 ring-brand/10' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                            >
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${formData.permissions.includes(perm) ? 'bg-brand text-white' : 'bg-white text-slate-300 group-hover:text-brand border border-slate-100'}`}>
                                     {formData.permissions.includes(perm) ? <CheckSquare size={16} /> : <Square size={16} />}
                                  </div>
                                  <span className={`text-[11px] font-black uppercase tracking-tight ${formData.permissions.includes(perm) ? 'text-brand' : 'text-slate-500'}`}>{perm.replace('_', ' ')}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </form>
             </div>

             {/* Modal Footer */}
             <div className="shrink-0 p-8 sm:px-10 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4 rounded-b-[40px]">
               <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-all">Discard</button>
               <button 
                  disabled={saving} 
                  form="roleForm" 
                  type="submit" 
                  className="flex items-center gap-3 px-10 py-4 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70"
               >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings2 size={16} />} 
                 {saving ? 'Saving...' : (editingRole ? 'Apply Changes' : 'Build Custom Role')}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
