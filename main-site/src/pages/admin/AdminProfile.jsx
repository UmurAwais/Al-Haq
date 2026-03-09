import React, { useState, useEffect } from 'react';
import { 
  UserCog, 
  Mail, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Loader2, 
  ShieldCheck, 
  LayoutGrid, 
  Clock, 
  Settings2,
  Activity,
  User,
  BadgeCheck
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/profile', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ name: profile.name })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess('Profile updated successfully.');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred during profile update.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ 
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword 
        })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess('Password changed successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred during password update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-500">
           <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Account Authority...</p>
        </div>
     );
  }

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 text-nowrap">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <UserCog className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Identity</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-accent" /> 
                System Access Profile
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Profile Summary Card */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden relative group">
               <div className="h-24 bg-brand relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                     <div className="w-20 h-20 bg-white rounded-[25px] border-4 border-white shadow-xl flex items-center justify-center text-brand">
                        <User size={40} />
                     </div>
                  </div>
               </div>

               <div className="pt-16 pb-12 px-8 text-center">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{profile.name || 'ADMINISTRATOR'}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{profile.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-8">
                     <span className="px-4 py-1.5 bg-brand/5 text-brand rounded-full border border-brand/10 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <BadgeCheck size={14} /> {profile.role || 'SUPER_ADMIN'} ACCESS
                     </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-tight">Active Duty</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Protection</p>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-tight">SSL Secured</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand/20">
               <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                  <ShieldCheck size={160} fill="white" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <Activity size={12} /> Security Protocol
                  </h3>
                  <p className="text-sm font-bold opacity-70 leading-relaxed mb-6 uppercase tracking-widest">
                     Multi-factor authorization is managed through Al-Haq's internal directory services.
                  </p>
                  <p className="text-[9px] font-black italic opacity-30 mt-10">* Contact HQ for policy overrides.</p>
               </div>
            </div>
         </div>

         {/* Settings & Password Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden p-8 sm:p-12">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <Settings2 size={16} className="text-brand" /> Identity Configuration
               </h3>

               <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Management Name</label>
                        <div className="relative group">
                           <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
                           <input 
                              type="text" 
                              value={profile.name}
                              onChange={e => setProfile({...profile, name: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest"
                              placeholder="YOUR NAME"
                           />
                        </div>
                     </div>
                     <div className="space-y-2 opacity-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Email Address</label>
                        <div className="relative">
                           <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                              disabled
                              type="email" 
                              value={profile.email}
                              className="w-full bg-slate-100 border border-slate-200 rounded-[22px] pl-14 pr-6 py-5 text-sm font-black text-slate-400 outline-none cursor-not-allowed uppercase tracking-widest"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Identity visible to teammates <br/> and system logs.</p>
                     <button 
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-5 bg-slate-900 border border-slate-900 hover:bg-brand hover:border-brand hover:shadow-xl hover:shadow-brand/20 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                     >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Finalize Update
                     </button>
                  </div>
               </form>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden p-8 sm:p-12 relative">
               <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-slate-100 to-transparent"></div>
               
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <Key size={16} className="text-brand" /> Credential Rotation
               </h3>

               {(error || success) && (
                  <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-3 animate-in fade-in duration-300 ${error ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-600'}`}>
                     {error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                     {error || success}
                  </div>
               )}

               <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Password</label>
                        <div className="relative group">
                           <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
                           <input 
                              type={showPass.current ? 'text' : 'password'} 
                              required
                              value={passwordData.currentPassword}
                              onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-12 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all"
                           />
                           <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand transition-colors">
                              {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Authority Key</label>
                        <div className="relative group">
                           <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
                           <input 
                              type={showPass.new ? 'text' : 'password'} 
                              required
                              value={passwordData.newPassword}
                              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded-[22px] pl-14 pr-12 py-5 text-sm font-black text-slate-800 focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all"
                           />
                           <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand transition-colors">
                              {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Matrix</label>
                        <div className="relative group">
                           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors"><ShieldCheck size={18} /></div>
                           <input 
                              type={showPass.confirm ? 'text' : 'password'} 
                              required
                              value={passwordData.confirmPassword}
                              onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="w-full bg-white border border-slate-200 rounded-[22px] pl-14 pr-12 py-5 text-sm font-black text-slate-800 focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all"
                           />
                           <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand transition-colors">
                              {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end pt-6">
                     <button 
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-5 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                     >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                        Update Security Key
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminProfile;
