import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Mail, 
  Clock, 
  Shield, 
  MoreVertical, 
  UserPlus,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Hash,
  Activity,
  UserCheck,
  UserMinus,
  ExternalLink,
  Plus,
  X,
  Lock,
  User,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { apiFetch } from '../../config';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query, orderBy, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  // Create User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: ''
  });
  const [successInfo, setSuccessInfo] = useState(null);
  const [syncResult, setSyncResult] = useState(null); // New state for sync feedback

  // Real-time listener from Firestore (if users are mirrored there)
  // Fallback to backend fetch if Firestore is empty or for initial load
  useEffect(() => {
    let unsubscribe = () => {};

    const setupListener = () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const firestoreUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt
          }));
          
          setUsers(firestoreUsers);
          setLoading(false);
        }, (err) => {
          console.error("Firestore listener error:", err);
          fetchUsers();
        });
      } catch (err) {
        console.error("Setup listener error:", err);
        fetchUsers();
      }
    };

    setupListener();
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch('/api/admin/users', {
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      if (data.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users from management server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFirebase = async () => {
    try {
      setSyncing(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch('/api/admin/users/sync-firebase', {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      if (data.ok) {
        setSyncResult({
          success: true,
          message: data.message || 'Sync successful!',
          imported: data.imported || 0,
          updated: data.updated || 0
        });
        fetchUsers();
      } else {
        setSyncResult({
          success: false,
          message: data.message || 'Sync failed.'
        });
      }
    } catch (err) {
      console.error('Sync error:', err);
      setSyncResult({
        success: false,
        message: 'Error connecting to sync service.'
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.ok) {
        // MIRROR TO FIRESTORE (important for real-time dashboard)
        await setDoc(doc(db, "users", data.user.uid), {
          uid: data.user.uid,
          email: data.user.email,
          displayName: data.user.displayName,
          referenceNumber: data.user.referenceNumber,
          status: 'active',
          role: 'student',
          createdAt: serverTimestamp(),
          lastSignIn: null
        });

        setSuccessInfo(data.user);
        setFormData({ email: '', displayName: '', password: '' });
        fetchUsers();
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Create user error:', err);
      setError('An error occurred while creating the user.');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setSuccessInfo(null);
    setFormData({ email: '', displayName: '', password: '' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'inactive':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'banned':
        return 'bg-slate-900 text-slate-400 border-slate-800';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.referenceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.uid || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || (user.status || 'active').toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    // Handle both Date objects and string/timestamps
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Users className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">User Directory</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" /> 
                {users.length} Registered Members
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={handleSyncFirebase}
              disabled={syncing}
              className={`flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-brand/30 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 ${syncing && 'opacity-70 pointer-events-none'}`}
            >
              {syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
              {syncing ? 'Syncing...' : 'Sync from Firebase'}
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:scale-95">
              <Plus size={16} strokeWidth={3} /> Add User
            </button>
        </div>
      </div>

      {/* Stat Bar Placeholder (Optional future use) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-brand/20 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center text-brand">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total users</p>
            <h3 className="text-xl font-bold text-slate-900">{users.length}</h3>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active', count: users.filter(u => (u.status || 'active') === 'active').length, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Inactive', count: users.filter(u => u.status === 'inactive').length, icon: UserMinus, color: 'text-amber-500', bg: 'bg-amber-50' },
          // { label: 'Admins', count: users.filter(u => u.role === 'admin').length || 1, icon: Shield, color: 'text-brand', bg: 'bg-brand/5' },
          { label: 'New Today', count: users.filter(u => formatDate(u.createdAt) === formatDate(new Date())).length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{stat.count}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="border-b border-slate-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-6 pb-0">
             <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name, email or ID..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-slate-50/50 transition-all text-slate-600 placeholder:text-slate-300"
                />
             </div>
             
             <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} /> {loading ? 'Syncing...' : 'Live view active'}
                </span>
             </div>
          </div>

          <div className="flex items-center px-6 mt-4 gap-8">
            {[
              { label: 'Everyone', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ].map(tab => (
              <button 
                key={tab.value} 
                onClick={() => setStatusFilter(tab.value)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest relative transition-all ${statusFilter === tab.value ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
                {statusFilter === tab.value && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full shadow-[0_-1px_4px_rgba(7,16,46,0.2)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Connecting to User Database...</p>
             </div>
          ) : filteredUsers.length === 0 ? (
             <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                    <Users size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight mb-2">Registry Empty</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No users found matching your current filter set</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ref. Number</th>
                      <th className="px-6 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                      <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredUsers.map((user) => (
                      <tr key={user.uid || user.id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-slate-100 p-0.5 border border-slate-200 overflow-hidden shadow-sm shadow-slate-100 group-hover:border-brand/30 transition-all">
                                  {user.profilePicture ? (
                                      <img src={user.profilePicture} alt="" className="w-full h-full object-cover rounded-xl" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                          <Shield size={20} />
                                      </div>
                                  )}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 tracking-tight leading-tight mb-0.5 group-hover:text-brand transition-colors uppercase">{user.displayName || 'Unnamed Cadet'}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                      <Hash size={10} /> {user.uid?.slice(-8).toUpperCase() || 'EXTERNAL'}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-slate-600 group-hover:text-brand transition-colors">
                                    <Mail size={12} className="opacity-40" />
                                    <span className="text-xs font-bold">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Activity size={12} className="opacity-30" />
                                        <span className="text-[10px] font-medium">{user.phone}</span>
                                    </div>
                                )}
                            </div>
                         </td>
                         <td className="px-6 py-6 font-mono">
                            <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-200 shadow-sm uppercase tracking-tighter">
                               {user.referenceNumber || 'NOT SYNCED'}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(user.status || 'active')}`}>
                               {user.status === 'inactive' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                               {user.status || 'ACTIVE'}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-right">
                            <p className="text-xs font-black text-slate-700 tracking-tighter mb-0.5">{formatDate(user.createdAt)}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Al-Haq Alumni</p>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <button className="p-2 text-slate-400 hover:text-brand hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 group/btn">
                                    <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 group/btn">
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
      
      {/* Sync Banner */}
      <div className="mt-8 p-8 rounded-[40px] bg-gradient-to-r from-brand to-[#0a1b4d] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-brand/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10">
                  <RefreshCw size={32} className={syncing ? 'animate-spin' : ''} />
              </div>
              <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mb-1">Firebase Sync Assistant</h4>
                  <p className="text-sm text-white/60 font-medium max-w-md">Ensure your local MongoDB user data matches Firebase Authentication records. This process imports new members and updates session statuses.</p>
              </div>
          </div>
          <button 
                onClick={handleSyncFirebase}
                disabled={syncing}
                className="relative z-10 px-8 py-4 bg-white text-brand rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
          >
              {syncing ? 'Processing Data...' : 'Begin Synchronization'}
          </button>
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{successInfo ? 'User Added' : 'Add New User'}</h2>
                <p className="text-xs text-slate-500 font-medium">{successInfo ? 'Registration complete' : 'Enter member details below'}</p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {successInfo ? (
                  <div className="text-center py-6">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[35px] flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100 shadow-sm">
                          <CheckCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Member Added Successfully</h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">System has generated the following credentials</p>
                      
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 text-left">
                          <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                              <span className="text-sm font-black text-slate-700">{successInfo.email}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporary Password</span>
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                  <Lock size={12} className="text-brand" />
                                  <span className="text-sm font-black text-brand font-mono">{successInfo.temporaryPassword}</span>
                              </div>
                          </div>
                      </div>
                      <p className="mt-6 text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                          <AlertCircle size={14} /> Password must be changed after first login
                      </p>
                  </div>
              ) : (
                <form id="createUserForm" onSubmit={handleCreateUser} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                        <input 
                            required 
                            type="text" 
                            value={formData.displayName} 
                            onChange={e => setFormData({...formData, displayName: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-wider" 
                            placeholder="CADET NAME" 
                        />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                        <input 
                            required 
                            type="email" 
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest" 
                            placeholder="CADET@ALHAQ.COM" 
                        />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
                        Password (Optional) <span className="text-[8px] opacity-40">AUTO-GENERATES IF EMPTY</span>
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                        <input 
                            type="password" 
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-[22px] pl-14 pr-6 py-4 text-sm font-bold text-slate-700 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-slate-200 uppercase" 
                            placeholder="••••••••" 
                        />
                      </div>
                  </div>
                  
                  <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-3 border border-blue-100/50">
                    <ShieldCheck size={24} className="text-brand shrink-0" />
                    <p className="text-[9px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                        Enrollment to Al-Haq Learning Hub will be processed automatically. A welcome email with credentials will be sent to the student.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
              {successInfo ? (
                  <button onClick={closeModal} className="flex-1 sm:flex-none px-10 py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-95">
                      Dismiss & Continue
                  </button>
              ) : (
                <>
                  <button disabled={saving} onClick={closeModal} type="button" className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-all disabled:opacity-50">Cancel</button>
                  <button disabled={saving} form="createUserForm" type="submit" className="flex items-center gap-3 px-10 py-4 bg-brand hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
                    {saving ? 'Authorizing...' : 'Register Member'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SYNC RESULT MODAL */}
      {syncResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSyncResult(null)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border shadow-sm transition-all duration-500 ${syncResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-red-50 border-red-100 text-red-500'}`}>
                {syncResult.success ? <CheckCircle size={32} /> : <XCircle size={32} />}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {syncResult.success ? 'Sync Complete' : 'Sync Failed'}
              </h3>
              
              <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
                {syncResult.message}
              </p>

              {syncResult.success && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Users</p>
                    <p className="text-xl font-bold text-slate-900">{syncResult.imported || 0}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Updated</p>
                    <p className="text-xl font-bold text-slate-900">{syncResult.updated || 0}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setSyncResult(null)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${syncResult.success ? 'bg-brand text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
