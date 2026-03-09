import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  PlayCircle, 
  ChevronRight,
  Filter,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentCourses = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');

  const enrolledCourses = [
    {
      id: 1,
      title: "Mastering Quranic Arabic: Basics to Advanced",
      instructor: "Dr. Ahmed Mansoor",
      progress: 65,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "2 days ago",
      duration: "12h 45m"
    },
    {
      id: 2,
      title: "Science of Tajweed & Qira'at",
      instructor: "Hafiz Bilal Qadri",
      progress: 30,
      image: "https://images.unsplash.com/photo-1585829365234-78d2b8514930?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "5 days ago",
      duration: "8h 20m"
    },
    {
      id: 3,
      title: "Islamic History: The Golden Age",
      instructor: "Prof. Maryam Saeed",
      progress: 90,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "Today",
      duration: "15h 00m"
    }
  ];

  const filteredCourses = enrolledCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 flex flex-col items-center md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none uppercase tracking-widest">My Learning Vault</h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-70">Enrolled tracks: {filteredCourses.length} Active</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
          <button 
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'enrolled' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Enrolled
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Finished
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand transition-colors" />
          <input 
            type="text" 
            placeholder="Search through your learning library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-slate-600 outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Courses Grid */}
      {activeTab === 'enrolled' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand/30 hover:-translate-y-1 transition-all group">
              <div className="aspect-video w-full bg-slate-100 relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4">
                   <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-brand shadow-sm">
                     <MoreVertical size={16} />
                   </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                   {course.instructor}
                </p>
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-4 line-clamp-2 h-12">
                   {course.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                   <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Course Progress</span>
                     <span className="text-brand">{course.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand rounded-full transition-all duration-1000" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-slate-400">
                     <Clock size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-tight">{course.duration} Total</span>
                   </div>
                   <button className="px-5 py-2.5 bg-brand text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-brand/20 hover:opacity-90 transition-all flex items-center gap-2">
                      Resume <PlayCircle size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
           <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">No Finished Courses</h3>
           <p className="text-slate-400 text-sm font-bold mt-2 max-w-xs uppercase tracking-tight">Complete your active lessons to earn certifications here.</p>
           <button 
             onClick={() => setActiveTab('enrolled')}
             className="mt-8 px-8 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-105 transition-transform"
           >
             Back to Learning
           </button>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
