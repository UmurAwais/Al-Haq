import React from 'react'
import { Trophy, GraduationCap, Award, CheckCircle2 } from 'lucide-react'

const SuccessCard = ({ story, variant = 'default' }) => {
  // variants: 'default' (for page grid), 'marquee' (for homepage carousel)
  const isFemale = story.gender === 'female'
  const genderBg = isFemale ? 'bg-rose-50' : 'bg-blue-50'
  const genderImage = isFemale ? '/woman.png' : '/man.png'
  
  if (variant === 'marquee') {
    return (
      <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden shrink-0 w-72 md:w-80 h-full flex flex-col">
        {/* Background Glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-10 -mr-16 -mt-16 blur-2xl transition-opacity duration-500`}></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-center mb-8 shrink-0">
            <div className={`w-24 h-24 rounded-full ${genderBg} border-4 border-slate-50 shadow-md group-hover:border-brand/20 transition-all relative flex items-center justify-center overflow-hidden`}>
              <img src={genderImage} alt="gender icon" className="w-full h-full object-cover" />
            </div>
            <div className={`absolute top-0 right-0 p-2.5 rounded-xl bg-brand text-white shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1 mb-6 text-center shrink-0">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand transition-colors">{story.name}</h3>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{story.exam}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span>{story.year}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-brand/5 group-hover:border-brand/10 transition-colors text-center mt-auto">
             <div className="flex items-center justify-center gap-2 text-brand mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-tight">Active Posting</span>
              </div>
            <p className="text-sm font-bold text-slate-700">{story.achievement}</p>
          </div>
        </div>
      </div>
    )
  }

  // Default variant (Simplified but retaining the SuccessCard "identity")
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand/20 hover:shadow-xl transition-all duration-300 flex flex-col group h-full relative overflow-hidden">
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-full ${genderBg} shrink-0 border-2 border-slate-50 shadow-sm group-hover:border-brand/20 transition-all flex items-center justify-center overflow-hidden`}>
          <img src={genderImage} alt="gender icon" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{story.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{story.year}</span>
            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
            <span>Allocated</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-auto relative z-10">
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-brand/5 group-hover:border-brand/10 transition-colors">
          <Trophy className="w-4 h-4 text-brand mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Achievement</div>
            <div className="text-sm font-bold text-slate-700 leading-snug">{story.achievement}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 pt-4 border-t border-slate-100">
          <GraduationCap className="w-4 h-4 text-slate-300 mt-0.5 shrink-0 group-hover:text-brand transition-colors" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</div>
            <div className="text-xs font-semibold text-slate-500">{story.dept || story.exam}</div>
          </div>
        </div>
      </div>

      {/* Subtle Background Mark */}
      <div className="absolute -bottom-4 -right-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <Award className="w-20 h-20 rotate-12" />
      </div>
    </div>
  )
}

export default SuccessCard
