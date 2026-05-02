import React, { useState, useEffect } from 'react';
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
  Star,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl, apiFetch } from '../../config';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [liveStatus, setLiveStatus] = useState({ isActive: false });
  const [loading, setLoading] = useState(false); // Default to false for immediate UI

  useEffect(() => {
    // 1. Initial Load from Cache for "Immediate" feel
    if (user?.uid) {
      const cachedData = localStorage.getItem(`dashboard_${user.uid}`);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setCourses(parsed.courses || []);
          setActivities(parsed.activities || []);
          console.log("⚡ Dashboard loaded from instant cache");
        } catch (e) {
          console.error("Cache corrupted");
        }
      }
    }

    if (user?.email) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      // Background fetch - UI is already functional from cache
      const results = await Promise.all([
        fetchEnrolledCourses(),
        fetchActivities(),
        fetchLiveStatus()
      ]);
      
      // 2. Update Cache after successful fetch
      if (user?.uid) {
        localStorage.setItem(`dashboard_${user.uid}`, JSON.stringify({
          courses: results[0] || courses,
          activities: results[1] || activities,
          lastUpdated: Date.now()
        }));
      }
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await apiFetch(`/api/student/activities/${user.email}`);
      const data = await res.json();
      if (data.ok) {
        setActivities(data.activities);
        return data.activities;
      }
    } catch (err) {
      console.error("Activities error:", err);
    }
  };

  const fetchLiveStatus = async () => {
    try {
      const res = await apiFetch('/api/live/status');
      const data = await res.json();
      if (data.ok) setLiveStatus(data.liveClass);
    } catch (err) {
      console.error("Live status error:", err);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await apiFetch('/api/student/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await response.json();
      if (data.ok) {
        setCourses(data.courses || []);
        return data.courses;
      }
    } catch (err) {
      console.error("Failed to fetch dashboard courses:", err);
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400";
    }
    if (imagePath.startsWith('http')) return imagePath;

    // Harmonize paths (replace backslashes from Windows servers)
    const normalizedPath = imagePath.replace(/\\/g, '/');
    const baseUrl = getApiUrl().replace(/\/$/, '');
    
    // Ensure the path has a leading slash for concatenation
    const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${baseUrl}${finalPath}`;
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400";
    e.target.onerror = null; // Prevent infinite loop
  };

  const stats = [
    { label: 'Courses Enrolled', value: courses.length, icon: BookOpen, color: 'blue' },
    { label: 'Verified Access', value: courses.filter(c => c.status?.toLowerCase() === 'verified' || c.status?.toLowerCase() === 'completed').length, icon: Award, color: 'emerald' },
    { label: 'Learning Progress', value: `${Math.round(courses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / (courses.length || 1))}%`, icon: Clock, color: 'brand' },
    { label: 'Pending Approval', value: courses.filter(c => c.status?.toLowerCase() === 'pending').length, icon: Target, color: 'orange' },
  ];

  const activeCourse = courses.find(c => c.progress > 0) || courses[0];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">Salaam, {user?.displayName?.split(' ')[0] || 'Student'}</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">
          {courses.length > 0 ? `Status: Enrolled in ${courses.length} educational tracks` : "Welcome to Al-Haq Learning Hub"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start lg:items-center gap-3 md:gap-5 group hover:border-brand transition-colors text-center md:text-left">
            <div className={`p-2.5 md:p-3 rounded-xl ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              stat.color === 'brand' ? 'bg-brand/5 text-brand' :
              'bg-orange-50 text-orange-600'
            }`}>
              <stat.icon size={20} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-none">{stat.value}</h3>
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
            
            {activeCourse ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm group">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={getFullImageUrl(activeCourse.image)} 
                      alt="Course" 
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="inline-flex items-center self-start gap-2 px-2.5 py-1 bg-brand/5 text-brand text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-lg">
                        {activeCourse.status?.toLowerCase() === 'pending' ? 'Verification Pending' : 'Currently Progressing'}
                      </div>
                      {activeCourse.status?.toLowerCase() === 'pending' && (
                        <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 italic">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" /> Approval Needed
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-4">{activeCourse.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-[9px] md:text-[10px] font-bold text-slate-400">
                        <span className="uppercase tracking-widest">Progress Bar</span>
                        <span className="text-brand">{activeCourse.progress || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${activeCourse.progress || 0}%` }}></div>
                      </div>
                    </div>

                    <div className="flex">
                      {activeCourse.status?.toLowerCase() === 'pending' ? (
                        <button disabled className="w-full md:w-auto px-10 py-3.5 md:py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest cursor-not-allowed border border-slate-200">
                            Awaiting Verfication... <Clock size={14} />
                        </button>
                      ) : (
                        <Link to={`/student/course/${activeCourse.id}/play`} className="w-full md:w-auto px-12 py-3.5 md:py-3 bg-brand text-white rounded-xl font-bold text-[10px] shadow-lg shadow-brand/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                            Resume Session <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                 <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Initialize Your Journey</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mb-8">You haven't enrolled in any educational tracks yet.</p>
                 <Link to="/#courses" className="inline-flex px-8 py-3 bg-brand text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand/10 active:scale-95 transition-all">Explore Courses</Link>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Interactive Sessions</h2>
            <div className="grid sm:grid-cols-2 gap-6">
                {/* Live Hub Session */}
                <div className={`p-6 bg-white border ${liveStatus?.isActive ? 'border-brand' : 'border-slate-200'} rounded-2xl relative overflow-hidden group`}>
                   {liveStatus?.isActive && (
                     <div className="absolute top-0 right-0 p-2">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-bold uppercase tracking-widest rounded-lg animate-pulse border border-red-100 italic">
                          <div className="w-1 h-1 rounded-full bg-red-600"></div> Live Now
                        </span>
                     </div>
                   )}
                   <div className="flex items-center gap-4 mb-4">
                      <div className={`p-2.5 rounded-xl ${liveStatus?.isActive ? 'bg-brand/5 text-brand' : 'bg-slate-50 text-slate-400'}`}>
                        <Zap size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{liveStatus?.topic || 'Weekly Halqa'}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           {liveStatus?.isActive ? 'Open Session' : 'Scheduled: Friday 08:30 PM'}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <span className="text-[10px] font-bold text-slate-400">Hub Exclusive</span>
                      {liveStatus?.isActive ? (
                        <Link to="/student/hub-live" className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
                          Enter Now <ChevronRight size={10} />
                        </Link>
                      ) : (
                        <button disabled className="text-[10px] font-bold text-slate-300 uppercase tracking-widest cursor-not-allowed">
                          Closed
                        </button>
                      )}
                   </div>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-2xl group hover:border-brand/40 transition-all">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">Personal Mentorship</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Request Sync</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <span className="text-[10px] font-bold text-slate-400">1-on-1 Access</span>
                      <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
                        Schedule <ChevronRight size={10} />
                      </button>
                   </div>
                </div>
            </div>
          </section>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-4 space-y-8">
           <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-100 flex flex-col">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Performance Feed</h2>
              <div className="space-y-6 flex-1">
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div key={activity.id || i} className="flex gap-4 group">
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === 'Achievement' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand/5 text-brand'} group-hover:scale-110 transition-transform`}>
                        {activity.type === 'Achievement' ? <Award size={14} /> : <Zap size={14} />}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-xs font-bold text-slate-900 leading-none mb-1 uppercase tracking-tight">{activity.title}</h4>
                        <p className="text-[9px] font-bold text-slate-400 lowercase leading-tight">{activity.desc}</p>
                        <p className="text-[8px] text-slate-300 font-bold uppercase mt-1 tracking-widest italic">{new Date(activity.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                     <TrendingUp className="w-10 h-10 mb-2" />
                     <p className="text-[9px] font-bold uppercase tracking-widest">No recent data points</p>
                  </div>
                )}
              </div>
              <Link to="/student/courses" className="w-full mt-10 py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-slate-100 hover:text-brand transition-all text-center">Journey Metrics</Link>
           </section>

           {/* <div className="bg-brand rounded-3xl p-8 text-white text-center relative overflow-hidden">
              <Star className="text-white/20 absolute -top-4 -right-4" size={64} />
              <h3 className="text-lg font-bold tracking-tight mb-2">Support Al-Haq</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">Donate To Spread Knowledge</p>
              <button className="w-full py-3 bg-white text-brand rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">Donate Now</button>
           </div> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
