import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  PlayCircle, 
  ChevronRight,
  Filter,
  CheckCircle2,
  MoreVertical,
  Loader2,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config';

const StudentCourses = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('enrolled');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
     try {
       setLoading(true);
       const res = await fetch(`${getApiUrl()}/api/student/enrolled-courses/${user.uid}`);
       const data = await res.json();
       if (data.ok) {
         setCourses(data.courses);
       }
     } catch (err) {
       console.error("Failed to fetch enrolled courses:", err);
     } finally {
       setLoading(false);
     }
  };

  const filteredCourses = courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
         <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Opening your learning portal...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 flex flex-col items-center md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-none uppercase tracking-widest">Learning Vault</h1>
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
        filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand/30 hover:-translate-y-1 transition-all group relative">
                <Link to={`/student/course/${course.id}/play`} className="absolute inset-0 z-10" />
                
                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                  <img 
                    src={course.image ? (course.image.startsWith('http') ? course.image : `${getApiUrl().replace(/\/$/, '')}${course.image.startsWith('/') ? '' : '/'}${course.image}`) : 'https://placehold.co/600x400/f1f5f9/64748b?text=No+Image'} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 z-20">
                     <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-brand shadow-sm">
                       <MoreVertical size={16} />
                     </button>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                     Online Course
                  </p>
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-4 line-clamp-2 h-12">
                     {course.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                     <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <span>Course Progress</span>
                       <span className="text-brand">0%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand rounded-full transition-all duration-1000 w-0" 
                        ></div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-tight">{course.duration || 'Flexible'}</span>
                     </div>
                     <div className="px-5 py-2.5 bg-brand text-white rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-brand/20 group-hover:opacity-90 transition-all flex items-center gap-2">
                        Start Learning <PlayCircle size={14} />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
             <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">No Active Courses</h3>
             <p className="text-slate-400 text-sm font-bold mt-2 max-w-xs uppercase tracking-tight">Explore our catalog to start your learning journey.</p>
             <Link 
               to="/#courses"
               className="mt-8 px-8 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-105 transition-transform"
             >
               Browse Courses
             </Link>
          </div>
        )
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
           <div className="w-16 h-16 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Finished Track Record</h3>
           <p className="text-slate-400 text-sm font-bold mt-2 max-w-xs uppercase tracking-tight">Complete your active lessons to unlock certifications here.</p>
           <button 
             onClick={() => setActiveTab('enrolled')}
             className="mt-8 px-8 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-brand/20 hover:scale-105 transition-transform"
           >
             Continue Learning
           </button>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
