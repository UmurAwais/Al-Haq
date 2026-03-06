import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Globe, 
  CheckCircle2, 
  PlayCircle,
  ChevronDown,
  Loader2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { getApiUrl } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useCart } from '../contexts/CartContext';

// Mock course curriculum
const MOCK_CURRICULUM = [
  {
    title: "Introduction",
    lecturesCount: "1 lectures",
    lectures: [
      { title: "Introduction To The Course", duration: "2:00", active: true }
    ],
    isOpen: true
  },
  {
    title: "English",
    lecturesCount: "13 lectures",
    lectures: [],
    isOpen: false
  },
  {
    title: "Pakistan Studies / Pakistan Affairs",
    lecturesCount: "12 lectures",
    lectures: [],
    isOpen: false
  },
  {
    title: "Islamic Studies",
    lecturesCount: "7 lectures",
    lectures: [],
    isOpen: false
  },
  {
    title: "Geography & General Knowledge",
    lecturesCount: "10 lectures",
    lectures: [],
    isOpen: false
  }
];

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/course/${id}`);
        const data = await res.json();
        if (res.ok && data.course) {
          setCourse(data.course);
        } else {
          setError(data.message || 'Course not found');
        }
      } catch (err) {
        setError('System connection error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center mt-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-slate-900 mb-2">Oops! {error}</h2>
          <p className="text-slate-500 mb-8">The course you are looking for might have been moved or deleted.</p>
          <Link to="/">
            <Button variant="primary">Back to Homepage</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = course.image?.startsWith('http') 
    ? course.image 
    : `${getApiUrl().replace(/\/$/, '')}${course.image?.startsWith('/') ? '' : '/'}${course.image}`;

  const coursePriceStr = String(course.price || '');
  const priceToDisplay = coursePriceStr.toLowerCase() === 'free' 
    ? 'Free' 
    : (coursePriceStr.startsWith('Rs') ? coursePriceStr : `Rs. ${coursePriceStr}`);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Header />
      
      {/* 1. Header Section - Dark Background */}
      <section className="bg-[#1C1D1F] pt-20 pb-16 lg:pb-20 font-sans overflow-visible z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 relative items-start">
            <div className="w-full lg:w-[65%]">
              {/* Breadcrumb / Category */}
              <div className="text-[#E31B23] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4">
                ONLINE COURSE • AL-HAQ LEARNING HUB
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white leading-[1.2] mb-4">
                {course.title}
              </h1>

              <p className="text-[15px] sm:text-base lg:text-[17px] text-white/90 mb-5 leading-relaxed font-medium">
                {course.excerpt || 'Master the subject with our comprehensive online course designed for students and professionals.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[14px]">
                 <div className="flex items-center gap-1.5 text-[#F59E0B]">
                    <span className="font-bold">{course.rating || '4.8'}</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                 </div>
                 <span className="text-white hover:underline cursor-pointer">
                   {course.ratingCount ? course.ratingCount.replace(/ratings?/gi, '').trim() + ' ratings' : '980 ratings'}
                 </span>
                 <span className="text-white mx-1">•</span>
                 <div className="flex items-center gap-1.5 text-white">
                    <Globe className="w-3.5 h-3.5 text-white" />
                    <span>{course.language || 'Urdu / Hindi (Online)'}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Body Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8 relative items-start">
            
            {/* Left Column */}
            <div className="w-full lg:w-[65%] shrink-0 space-y-6">
              
              {/* Card 1: Course Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-5 bg-brand rounded-full"></div>
                       <h2 className="text-lg font-bold text-slate-900 tracking-tight">Course Preview</h2>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold cursor-pointer hover:bg-slate-200 transition-colors">
                       <PlayCircle size={12} className="inline mr-1 -mt-0.5" />
                       117 lectures
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50/50">
                    <div className="w-full aspect-video bg-slate-900 rounded-lg overflow-hidden relative group cursor-pointer border border-slate-200">
                       <img src={imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <PlayCircle size={32} className="text-white fill-white/20" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Card 2: Course Curriculum */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Course Curriculum</h2>
                 </div>
                 <div className="p-0">
                    {MOCK_CURRICULUM.map((section, idx) => (
                       <div key={idx} className="border-b border-slate-100 last:border-0">
                          <div className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100 cursor-pointer transition-colors">
                             <div className="flex items-center gap-3">
                                <ChevronDown size={16} className="text-slate-500" />
                                <span className="text-[15px] font-bold text-slate-900">{section.title}</span>
                             </div>
                             <span className="text-xs text-slate-500 font-medium">{section.lecturesCount}</span>
                          </div>
                          {section.isOpen && section.lectures && section.lectures.length > 0 && (
                             <div className="bg-brand/5 border-l-2 border-brand mx-0 py-3 px-6">
                                {section.lectures.map((lecture, lIdx) => (
                                   <div key={lIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <div className="flex items-start gap-3">
                                         <PlayCircle size={16} className="text-brand shrink-0 mt-0.5" />
                                         <div>
                                            <p className="text-[14px] font-bold text-brand leading-tight">{lecture.title}</p>
                                            {lecture.active && <p className="text-[10px] uppercase font-bold text-brand/70 tracking-widest mt-1">Currently Watching</p>}
                                         </div>
                                      </div>
                                      <span className="text-xs text-brand font-medium sm:ml-auto">{lecture.duration}</span>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                    
                    <div className="p-6 bg-slate-50/80">
                       <div className="bg-brand/5 border border-brand/20 rounded-lg p-4 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-brand shrink-0" />
                          <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                            <span className="font-bold text-brand">Unlock Course:</span> Enroll now to get full session access to all recorded coursework, downloadable resources, and start your learning journey.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Card 3: What you'll learn */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">What you'll learn</h2>
                 </div>
                 <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
                       {(course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : [
                          "Master the art of competitive exam preparation",
                          "Understand the structure and format of competitive exams",
                          "Learn effective study strategies and time management techniques",
                          "Develop a strong foundation in core subjects",
                          "Improve your English language skills for competitive exams"
                       ]).map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                             <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                             <span className="text-[14px] text-slate-700 leading-snug">{item}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Card 4: Course Description */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Course description</h2>
                 </div>
                 <div className="p-6">
                    <div className="text-[15px] text-slate-700 leading-relaxed space-y-4">
                       <p>Welcome to the ultimate masterclass, designed to give you the competitive edge needed to secure a high-ranking position.</p>
                       <p>This is not just a syllabus overview; it's a strategic study program. Our course is meticulously structured to cover the entire curriculum, focusing on both the objective (MCQs) and subjective parts of the examination.</p>
                       <p>All classes are conducted online so you can join from any city. You'll also receive assignments to implement each step directly in your own space as you learn.</p>
                       <p className="font-bold text-slate-900 pt-2">What makes this course stand out?</p>
                       <ul className="space-y-2 list-none text-slate-600">
                          <li><strong>-&gt; Targeted Content:</strong> Deep dives into current affairs, which are critical scoring areas.</li>
                          <li><strong>-&gt; Skill Development:</strong> Dedicated modules for improving your English Essay and Precis Writing.</li>
                          <li><strong>-&gt; Comprehensive Coverage:</strong> In-depth study of all core subjects.</li>
                          <li><strong>-&gt; Interview Focus:</strong> Practical guidance and mock sessions to prepare you for the final hurdle.</li>
                       </ul>
                    </div>
                 </div>
              </div>

            </div>

            {/* Right Column (Sticky Enrollment Card) */}
            <div className="w-full lg:w-[32%] lg:sticky lg:top-24 mt-0 lg:-mt-[300px] xl:-mt-[340px] z-30 lg:ml-auto">
              <div className="bg-white border border-slate-200 rounded-xl lg:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] lg:border-t-0 p-1 lg:p-0">
                 {/* Top Image (Hidden on mobile since Preview card is prominent) */}
                 <div className="hidden lg:block aspect-[16/9] w-full relative bg-black pt-[2px] pr-[2px] pl-[2px] rounded-xl">
                    <img src={imageUrl} alt={course.title} className="w-full h-full object-cover rounded-3xl" />
                 </div>
                 
                 <div className="p-6">
                    <div className="text-3xl font-black text-slate-900 mb-1">
                       {priceToDisplay}
                    </div>
                    <div className="text-[13px] text-slate-500 font-medium mb-5 tracking-tight">
                       Online course + {course.lectures?.length || '23'} Recordings
                    </div>

                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(course);
                        navigate('/cart');
                      }} 
                      className="w-full py-4 text-center text-[15px] font-extrabold bg-[#0B9625] text-white hover:bg-[#097b1e] transition-colors justify-center mb-4"
                    >
                       Enroll now
                    </Button>

                    <p className="text-[11px] text-slate-500 leading-relaxed text-center mb-6">
                       Enroll now to get full access to live classes, recordings, assignments and Q/A.
                    </p>

                    <div className="mb-6">
                       <p className="text-[13px] font-bold text-slate-900 mb-3">
                          This online course includes:
                       </p>
                       <ul className="space-y-2.5">
                          {[
                             "Online live sessions with instructor",
                             "Practice tests and mock exams",
                             "Study materials and resources",
                             "Certificate of completion from Al-Haq Learning Hub"
                          ].map((inc, i) => (
                             <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-600">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                                <span className="leading-snug">{inc}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-100">
                       <a href="#" className="text-[13px] text-brand font-bold hover:underline">
                          Have questions? Contact support.
                       </a>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
