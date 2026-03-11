import React, { useEffect, useState, useRef } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 1. Optimistic Update (Immediate Feedback)
    const originalUser = { ...user };
    const optimisticUser = { 
      ...user, 
      displayName: formData.displayName, 
      phone: formData.phone, 
      location: formData.location 
    };
    
    // Temporarily update avatar if a new one is selected
    if (previewUrl) {
      optimisticUser.photoURL = previewUrl;
    }
    
    setUser(optimisticUser);
    setSaving(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('uid', user.uid);
      formDataToSend.append('displayName', formData.displayName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location', formData.location);
      
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      const res = await fetch(`${getApiUrl()}/api/student/profile/update`, {
        method: 'POST',
        body: formDataToSend,
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid server response");
      }

      const data = await res.json();
      if (data.ok) {
        // Final sync with server data
        setUser({ ...user, ...data.user });
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        // Rollback on failure
        setUser(originalUser);
        alert(data.message || "Sync failed.");
      }
    } catch (err) {
      // Rollback on error
      setUser(originalUser);
      console.error(err);
      alert("Verification Error: Changes could not be committed.");
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = previewUrl || user?.photoURL || user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.displayName || 'S'}&background=07102e&color=fff&bold=true`;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">Personal Identity</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">Manage your digital presence & vault details</p>
      </div>

      <div className="grid gap-10">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-10 items-center">
           <div className="relative group shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center p-1 shadow-sm group-hover:border-brand transition-all overflow-hidden">
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white"
              >
                <Camera size={14} className="md:w-[16px] md:h-[16px]" />
              </button>
           </div>

           <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-baseline justify-center md:justify-start gap-2 md:gap-4 mb-3 md:mb-1">
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-none uppercase tracking-widest truncate">{user?.displayName || 'Student'}</h2>
                 <div className="inline-flex items-center self-center md:self-auto gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-emerald-100 italic">
                    <CheckCircle2 size={10} /> Identity Verified
                 </div>
              </div>
              <p className="text-slate-400 text-[11px] font-bold lowercase tracking-normal flex items-center justify-center md:justify-start gap-2 opacity-80">
                 <Mail size={12} className="text-brand/40" /> {user?.email}
              </p>
              
              <div className="mt-8 md:mt-10 flex items-center justify-around md:justify-start md:gap-16 border-t border-slate-50 md:border-0 pt-6 md:pt-0">
                 <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-2">Current Rank</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                      <p className="text-xs font-bold text-slate-700 tracking-widest uppercase italic">Elite Cadet</p>
                    </div>
                 </div>
                 <div className="w-px h-8 bg-slate-100 md:hidden"></div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-2">Member Since</p>
                    <p className="text-xs font-bold text-slate-700 tracking-widest uppercase">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Mar 2024'}
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Form Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
           <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-10 border-b border-slate-50 pb-4 relative z-10">Vault Credentials</h3>
           
           <form onSubmit={handleSave} className="space-y-10 relative z-10">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
               <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-60">Full Identity Name</label>
                 <div className="relative group">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="text" 
                     name="displayName"
                     value={formData.displayName}
                     onChange={handleChange}
                     className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-60">Registered Email</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={16} />
                   <input 
                     type="email" 
                     value={user?.email || ''}
                     disabled
                     className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-50 text-slate-300 text-sm font-bold italic cursor-not-allowed opacity-60 grayscale" 
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-60">WhatsApp Endpoint</label>
                 <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     placeholder="+92 3XX XXXX XXX"
                     className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 opacity-60">Region / Province</label>
                 <div className="relative group">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="text" 
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     placeholder="Global Hub..."
                     className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>
             </div>

             <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-slate-50">
               <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Shield size={16} className="text-emerald-600" />
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">End-to-End Encryption Activated</p>
               </div>
               <button 
                 type="submit"
                 disabled={saving}
                 className="w-full sm:w-auto px-16 py-4 rounded-2xl bg-brand text-white text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-brand/30 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 {saving ? 'Saving...' : 'Save Changes'}
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
