import React, { useState, useEffect } from 'react';
import { 
  Video, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../../config';

const StudentLive = () => {
  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/live/status`);
      const data = await res.json();
      if (data.ok) {
        setLiveClass(data.liveClass);
      }
    } catch (err) {
      console.error("Failed to fetch live status:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {liveClass?.isActive ? (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-brand p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-6 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div> Active Now
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Hub Live: {liveClass.topic}</h1>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest italic">Hosted by Al-Haq Learning Hub Team</p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Class Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Clock size={18} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Time</p>
                          <p className="text-sm font-bold text-slate-900">{new Date(liveClass.startTime).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <ShieldCheck size={18} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meeting ID</p>
                          <p className="text-sm font-bold text-slate-900 tracking-wider">
                            {liveClass.meetingId?.match(/.{1,3}/g)?.join(' ') || '--- --- ----'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <div className="flex gap-4">
                      <AlertCircle className="text-blue-600 shrink-0" size={20} />
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Please ensure you have Zoom installed on your device. Use the same name as your profile for easy verification by the moderator.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-center text-white flex flex-col items-center justify-center min-h-[300px] border border-white/10 shadow-2xl">
                   <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                      <Video size={32} className="text-brand-light" />
                   </div>
                   <h2 className="text-xl font-bold tracking-tight mb-2">Ready to Join?</h2>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Secure Connection Initialized</p>
                   
                   <a 
                    href={`https://zoom.us/j/${liveClass.meetingId}?pwd=${liveClass.passcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     Launch Zoom <ExternalLink size={14} />
                   </a>
                   <p className="mt-6 text-[10px] text-white/20 font-medium">Passcode: {liveClass.passcode || 'Not Required'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <Video className="text-slate-200" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Class is Currently Offline</h2>
            <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed italic">
              There is no active session right now. Our weekly sessions usually take place on Friday evenings. Stay tuned for announcements!
            </p>
            <div className="mt-10 pt-8 border-t border-slate-50">
              <Link to="/student/dashboard" className="px-8 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white transition-all">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLive;
