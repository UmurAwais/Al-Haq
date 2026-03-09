import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Courses Enrolled', value: '4', icon: BookOpen, color: 'blue' },
    { label: 'Completed', value: '1', icon: Award, color: 'emerald' },
    { label: 'Learning Hours', value: '12.5', icon: Clock, color: 'brand' },
    { label: 'Skill Points', value: '850', icon: Target, color: 'orange' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">Salaam, {user?.displayName?.split(' ')[0] || 'Student'}</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Status: Active Track • Continuous Progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-brand transition-colors">
            <div className={`p-3 rounded-xl ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              stat.color === 'brand' ? 'bg-brand/5 text-brand' :
              'bg-orange-50 text-orange-600'
            }`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Learning */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Active Learning</h2>
              <Link to="/student/courses" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm group">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" alt="Course" className="w-full h-full object-cover grayscale-0 hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand/5 text-brand text-[9px] font-bold uppercase tracking-widest rounded-lg mb-3">
                    Currently Progressing
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Mastering Quranic Arabic: Basics to Advanced</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="uppercase tracking-widest">Progress</span>
                      <span className="text-brand">62% COMPLETE</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <button className="w-full sm:w-auto px-10 py-3 bg-brand text-white rounded-xl font-bold text-xs shadow-lg shadow-brand/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                     Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Upcoming Sessions</h2>
            <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { title: 'Weekly Halqa', date: 'Tomorrow, 08:00 PM', time: '1h 30m', color: 'blue' },
                 { title: 'Personal Mentorship', date: '15 Mar, 10:00 AM', time: '45m', color: 'emerald' },
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-brand/40 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                       <div className={`p-2.5 rounded-xl ${item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                         <Clock size={18} />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{item.title}</h4>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                       <span className="text-[10px] font-bold text-slate-400">1h 30m</span>
                       <button className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         Join Now <ChevronRight size={10} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Performance Feed</h2>
              <div className="space-y-6">
                {[
                  { title: 'Quiz Completed', desc: 'Arabic Vocabulary II', date: '2h ago', icon: <Target size={14} /> },
                  { title: 'Achievement', desc: '7 Day Streak!', date: '6h ago', icon: <Award size={14} /> },
                  { title: 'Unlocked', desc: 'Advanced Tajweed', date: '1d ago', icon: <Zap size={14} /> },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {activity.icon}
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-none mb-1 uppercase tracking-tight">{activity.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 lowercase">{activity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-colors">More Insights</button>
           </section>

           <div className="bg-brand rounded-3xl p-8 text-white text-center relative overflow-hidden">
              <Star className="text-white/20 absolute -top-4 -right-4" size={64} />
              <h3 className="text-lg font-bold tracking-tight mb-2">Support Al-Haq</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">Donate To Spread Knowledge</p>
              <button className="w-full py-3 bg-white text-brand rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">Donate Now</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
