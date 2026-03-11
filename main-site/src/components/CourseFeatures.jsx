import React from 'react'
import { Globe2, ShieldCheck, Trophy } from 'lucide-react'

const CourseFeatures = () => {
  const pillars = [
    {
      title: "One-Paper Mastery",
      desc: "Master PPSC, FPSC, and NTS patterns with focused test series and expert techniques.",
      icon: Globe2
    },
    {
      title: "Affordable Access",
      desc: "Premium quality preparation material at a fraction of academy prices.",
      icon: ShieldCheck
    },
    {
      title: "Self-Paced Learning",
      desc: "Access video lectures and mock tests 24/7. Study when you want, where you want.",
      icon: Trophy
    }
  ]

  return (
    <section className="pb-20 bg-slate-50/50">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div 
              key={i} 
              className="group bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
            >
              <div className="mb-8 w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-500 shadow-sm">
                <pillar.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-brand transition-colors">
                {pillar.title}
              </h3>
              <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourseFeatures
