import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Clock, 
  User, 
  Zap, 
  ShieldCheck, 
  Database, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Loader2, 
  Filter, 
  Calendar,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await apiFetch('/api/admin/activity-logs', {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (data.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = typeFilter === 'all' || log.action?.split(' ')[0].toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getActionStyles = (action) => {
    const act = action?.toLowerCase() || '';
    if (act.includes('delete')) return { bg: 'bg-red-50 text-red-600 border-red-100', icon: <XCircle size={14} /> };
    if (act.includes('create') || act.includes('upload')) return { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <CheckCircle2 size={14} /> };
    if (act.includes('update')) return { bg: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Info size={14} /> };
    return { bg: 'bg-slate-100 text-slate-500 border-slate-200', icon: <Activity size={14} /> };
  };

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <Activity className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">System Ledger</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Database size={14} className="text-brand-accent" /> 
                {logs.length} Immutable Events Recorded
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                 <input 
                   type="text" 
                   placeholder="SEARCH BY ADMIN OR ACTION..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-11 pr-4 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-700 placeholder:text-slate-300 tracking-widest uppercase"
                 />
              </div>

              <select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="appearance-none pl-6 pr-12 py-4 text-xs font-black border border-slate-200 rounded-2xl outline-none focus:border-brand/30 bg-white cursor-pointer uppercase tracking-widest text-slate-600 hover:border-slate-300 transition-all"
              >
                 <option value="all">ALL ACTIONS</option>
                 <option value="create">CREATION</option>
                 <option value="update">UPDATES</option>
                 <option value="delete">DELETIONS</option>
              </select>
           </div>

           <div className="px-4 py-2 bg-brand/5 rounded-xl border border-brand/5">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} /> Real-time Streaming Enabled
                </span>
           </div>
        </div>

        {/* Activity Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Event History...</p>
             </div>
          ) : filteredLogs.length === 0 ? (
             <div className="py-32 text-center text-slate-300">
                <Activity size={64} className="mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-black uppercase tracking-tight">No Events Logged</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System activity will appear here</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrator</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action Type</th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Trace</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredLogs.map((log) => {
                      const styles = getActionStyles(log.action);
                      return (
                        <tr key={log._id} className="group hover:bg-slate-50/50 transition-all">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all">
                                    <User size={18} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-tight group-hover:text-brand transition-colors lowercase truncate max-w-37.5">{log.adminEmail}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Management Account</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${styles.bg}`}>
                                 {styles.icon}
                                 {log.action}
                              </span>
                           </td>
                           <td className="px-6 py-6">
                              <div className="flex items-center gap-3">
                                 <ArrowRight size={12} className="text-slate-300" />
                                 <p className="text-xs font-bold text-slate-500 line-clamp-1 max-w-75 uppercase tracking-tight italic">
                                    {log.details || 'NO ADDITIONAL CONTEXT'}
                                 </p>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-700 font-black tracking-tighter text-xs">
                                 <Clock size={12} className="text-slate-400" />
                                 {new Date(log.createdAt).toLocaleDateString()}
                                 <span className="opacity-30 mx-1">|</span>
                                 {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </td>
                        </tr>
                      );
                   })}
                </tbody>
             </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminActivityLog;
