import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Circle, 
  Menu, 
  X, 
  Download, 
  MessageSquare, 
  FileText, 
  Info,
  Clock,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config';

const CoursePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLecture, setActiveLecture] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [completedLectures, setCompletedLectures] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getApiUrl()}/api/course/${courseId}`);
      const data = await res.json();
      if (data.ok) {
        setCourse(data.course);
        
        // Find initial lecture
        const sections = data.course.lectures || [];
        if (sections.length > 0) {
          // Flatten sections to find all lectures
          const allLectures = sections.flatMap(s => s.lectures || []);
          
          if (lectureId) {
            const found = allLectures.find(l => l.id === lectureId);
            setActiveLecture(found || allLectures[0]);
          } else {
            setActiveLecture(allLectures[0]);
          }

          // Expand the section of the active lecture
          const initialExpanded = {};
          sections.forEach(s => {
            if (s.lectures?.some(l => l.id === (lectureId || allLectures[0]?.id))) {
              initialExpanded[s.id] = true;
            }
          });
          setExpandedSections(initialExpanded);
        }
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLectureSelect = (lecture) => {
    setActiveLecture(lecture);
    navigate(`/student/course/${courseId}/play/${lecture.id}`);
  };

  const toggleLectureCompletion = (id) => {
    setCompletedLectures(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Preparing your learning environment...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <Info className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
          <p className="text-slate-500 font-medium mb-8">We couldn't find the course you're looking for or your enrollment has expired.</p>
          <Link to="/student/courses" className="inline-flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand/20">
            Back to my courses
          </Link>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const totalLectures = (course.lectures || []).flatMap(s => s.lectures || []).length;
  const progressPercent = totalLectures > 0 ? Math.round((completedLectures.length / totalLectures) * 100) : 0;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/student/courses" className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all border border-slate-100 hover:text-brand">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-50 md:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
             <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" 
                    strokeDasharray={126} strokeDashoffset={126 - (126 * progressPercent) / 100}
                    className="text-brand transition-all duration-1000" />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-700">{progressPercent}%</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Progress</span>
                <span className="text-[10px] font-bold text-slate-700">{completedLectures.length} / {totalLectures} Lessons</span>
             </div>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10 hover:bg-brand transition-all">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Player Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content (Video + Tabs) */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar bg-white transition-all duration-300 ${sidebarOpen ? 'mr-0' : 'mr-0'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Aspect Ratio Video Container */}
            <div className="aspect-video bg-black relative group shadow-2xl overflow-hidden">
               {activeLecture?.video?.id ? (
                 <iframe 
                   src={`https://drive.google.com/file/d/${activeLecture.video.id}/preview`}
                   className="w-full h-full border-0"
                   allow="autoplay; encrypted-media"
                   allowFullScreen
                   title={activeLecture.title}
                 ></iframe>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-white p-10 bg-linear-to-br from-slate-900 to-brand/20">
                   <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 animate-pulse">
                     <Video className="w-10 h-10 text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">Ready to Learn?</h3>
                   <p className="text-white/60 text-sm max-w-sm text-center">This lesson's video is currently being processed or pending cloud assignment.</p>
                 </div>
               )}
            </div>

            {/* Bottom Content Container */}
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {activeLecture?.title || "Welcome to the Course"}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-widest">
                       <Play size={14} className="text-brand" /> Current Session
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {progressPercent}% Complete
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleLectureCompletion(activeLecture?.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${completedLectures.includes(activeLecture?.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  <CheckCircle2 size={16} /> {completedLectures.includes(activeLecture?.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 mb-8 overflow-x-auto no-scrollbar border-b border-slate-100">
                {['overview', 'resources', 'notes', 'announcements'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-100">
                {activeTab === 'overview' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4">About this lesson</h3>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium">
                         {activeLecture?.description || "In this session, we'll dive deep into the core concepts, practical applications, and expert techniques that will accelerate your learning journey. Follow along closely and don't hesitate to check the resources tab for additional materials."}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                          <Clock className="w-6 h-6 text-brand mb-4" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Duration</h4>
                          <p className="text-sm font-bold text-slate-500">12:45 total time</p>
                       </div>
                       <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                          <Globe className="w-6 h-6 text-brand mb-4" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Language</h4>
                          <p className="text-sm font-bold text-slate-500">{course.language}</p>
                       </div>
                       <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                          <Star className="w-6 h-6 text-brand mb-4" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Skill Level</h4>
                          <p className="text-sm font-bold text-slate-500">All Levels</p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {activeLecture?.pdf ? (
                      <a 
                        href={`https://drive.google.com/file/d/${activeLecture.pdf.id}/view?usp=sharing`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-brand/20 transition-all cursor-pointer"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand transition-all">
                               <FileText size={24} />
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-900">{activeLecture.pdf.name}</h4>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Document Attachment</p>
                            </div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all">
                            <Download size={18} />
                         </div>
                      </a>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                        <FileText size={48} className="text-slate-300 mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No resources for this lesson</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Curriculum (collapsible) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-white border-l border-slate-100 flex flex-col relative shrink-0 z-10"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Course Content</h3>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{progressPercent}% COMPLETE</span>
                  <span>{completedLectures.length}/{totalLectures} LESSONS</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {(course.lectures || []).map((section, sIndex) => (
                  <div key={section.id || sIndex} className="border-b border-slate-50 last:border-b-0">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-6 text-left hover:bg-slate-50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Module {sIndex + 1}</span>
                        <h4 className="text-sm font-black text-slate-800 line-clamp-1">{section.sectionTitle}</h4>
                      </div>
                      <div className={`transition-transform duration-300 ${expandedSections[section.id] ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} className="text-slate-300 group-hover:text-brand" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedSections[section.id] && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30"
                        >
                          {(section.lectures || []).map((lecture, lIndex) => {
                            const isActive = activeLecture?.id === lecture.id;
                            const isCompleted = completedLectures.includes(lecture.id);

                            return (
                              <button 
                                key={lecture.id}
                                onClick={() => handleLectureSelect(lecture)}
                                className={`w-full px-6 py-4 flex items-start gap-3 transition-all text-left border-l-4 ${isActive ? 'bg-brand/5 border-brand' : 'border-transparent hover:bg-slate-50'}`}
                              >
                                <div className="mt-0.5" onClick={(e) => { e.stopPropagation(); toggleLectureCompletion(lecture.id); }}>
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                  ) : (
                                    <Circle size={18} className="text-slate-200" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lesson {lIndex + 1}</span>
                                  </div>
                                  <p className={`text-[13px] font-bold ${isActive ? 'text-brand' : 'text-slate-700'}`}>
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                      <Play size={10} /> 12:45
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursePlayer;
