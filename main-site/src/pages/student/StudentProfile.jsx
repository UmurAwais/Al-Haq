import React, { useEffect, useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Identity</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your account and profile details</p>
      </div>

      <div className="grid gap-10">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-10 items-center">
           <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center p-0.5 shadow-sm group-hover:border-brand transition-colors">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.displayName || 'S'}&background=ffffff&color=07102e&bold=true`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-lg shadow-xl hover:scale-105 transition-all outline-none border-2 border-white">
                <Camera size={14} />
              </button>
           </div>

           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                 <h2 className="text-xl font-bold text-slate-900 leading-none uppercase tracking-widest">{user?.displayName || 'Student'}</h2>
                 <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-emerald-100">
                    <CheckCircle2 size={10} /> Account Verified
                 </div>
              </div>
              <p className="text-slate-400 text-xs font-bold lowercase tracking-normal flex items-center justify-center md:justify-start gap-2">
                 <Mail size={12} /> {user?.email}
              </p>
              
              <div className="mt-8 flex items-center justify-center md:justify-start gap-10">
                 <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Rank</p>
                    <p className="text-xs font-bold text-slate-600 tracking-widest uppercase">Platinum Student</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1.5">Joined</p>
                    <p className="text-xs font-bold text-slate-600 tracking-widest uppercase">Mar 2024</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Form Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-8 border-b border-slate-50 pb-4">Personal Details</h3>
           
           <form onSubmit={handleSave} className="space-y-10">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Preferred Name</label>
                 <div className="relative">
                   <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                     type="text" 
                     name="displayName"
                     value={formData.displayName}
                     onChange={handleChange}
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={16} />
                   <input 
                     type="email" 
                     value={user?.email || ''}
                     disabled
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-50 text-slate-300 text-sm font-bold italic cursor-not-allowed" 
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp/Phone</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     placeholder="+92 3XX XXXX XXX"
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Region/Location</label>
                 <div className="relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                     type="text" 
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     placeholder="Global Hub..."
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:border-brand/40 outline-none transition-all text-sm font-bold text-slate-900" 
                   />
                 </div>
               </div>
             </div>

             <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50">
               <div className="flex items-center gap-3 opacity-50">
                 <Shield size={14} className="text-emerald-600" />
                 <p className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encryption Enabled</p>
               </div>
               <button 
                 type="submit"
                 disabled={saving}
                 className="w-full sm:w-auto px-12 py-3.5 rounded-xl bg-brand text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
               >
                 {saving ? 'Updating...' : 'Commit Changes'}
               </button>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
