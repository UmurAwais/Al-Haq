import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Search, 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight,
  TrendingUp,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentCertificates = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const certificates = [
    {
      id: 1,
      name: "The Holy Quran Recitation Certificate",
      instructor: "Hafiz Bilal Qadri",
      dateEarned: "Feb 12, 2024",
      grade: "A+",
      issuer: "Al-Haq Learning Hub",
      image: "https://images.unsplash.com/photo-1541829081725-6f1c93ad3cd2?auto=format&fit=crop&q=80&w=400",
      type: "Online Completion"
    },
    {
      id: 2,
      name: "Islamic Foundations: Basic Jurisprudence",
      instructor: "Dr. Ahmed Mansoor",
      dateEarned: "Jan 05, 2024",
      grade: "A",
      issuer: "Al-Haq Academy",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400",
      type: "Master Class"
    }
  ];

  const filteredCertificates = certificates.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-10 flex flex-col items-center md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none uppercase tracking-widest">Achievements</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">Legacy of your educational journey</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-brand uppercase tracking-widest leading-none mb-1">Rank Status</p>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Top Tier Performer</p>
           </div>
           <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
             <TrendingUp size={24} />
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Certificate Feed */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-slate-600 outline-none focus:border-brand/40 transition-all shadow-sm"
                />
              </div>
              <button className="px-8 py-3.5 bg-brand text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-105 transition-transform flex items-center gap-2">
                 Verify Registry <CheckCircle2 size={16} />
              </button>
           </div>

           {filteredCertificates.length > 0 ? (
             <div className="grid gap-6">
               {filteredCertificates.map((cert) => (
                 <div key={cert.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:border-brand/20 transition-all items-center">
                    <div className="w-40 h-40 bg-slate-50 border border-slate-100 rounded-2xl p-1 shrink-0 relative overflow-hidden group">
                       <img 
                         src={cert.image} 
                         alt="CertificateThumbnail" 
                         className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500" 
                       />
                       <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                          <span className="text-[10px] font-bold text-brand uppercase tracking-widest px-2 py-0.5 bg-brand/5 border border-brand/5 rounded-lg inline-block w-fit mx-auto md:mx-0">
                            {cert.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Earned: {cert.dateEarned}
                          </span>
                       </div>
                       
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug mb-2">{cert.name}</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Instructor: <span className="text-slate-600">{cert.instructor}</span></p>

                       <div className="flex flex-col sm:flex-row items-center gap-4">
                          <button className="w-full sm:w-auto px-10 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                             Download PDF <Download size={14} />
                          </button>
                          <button className="w-full sm:w-auto px-10 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-2">
                             Share Publicly <MoreHorizontal size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Award size={40} className="text-slate-200 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Growth in Progress</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Finish your active courses to unlock your official registry.</p>
             </div>
           )}
        </div>

        {/* Info Area */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-50 pb-4">Badge Analytics</h2>
              <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                 <div>
                    <div className="aspect-square bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
                       <Award size={20} />
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Silver Scholar</p>
                 </div>
                 <div>
                    <div className="aspect-square bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-brand/10">
                       <CheckCircle2 size={20} />
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Quick Learner</p>
                 </div>
                 <div>
                    <div className="aspect-square bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-slate-100">
                       <Mail size={20} />
                    </div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">Contributor</p>
                 </div>
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-colors">Digital Wallet</button>
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
              <Award className="text-brand mx-auto mb-6" size={48} />
              <h3 className="font-bold mb-2 uppercase tracking-[0.2em] text-sm">Al-Haq Ranking</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">You are in the top 5% of active students this month.</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-8">
                 <div className="h-full bg-brand w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
              </div>
              <button className="w-full py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand/20">Global Board</button>
           </section>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;
