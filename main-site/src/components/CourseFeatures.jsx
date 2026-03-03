import React from 'react'
import { Globe2, ShieldCheck, Trophy } from 'lucide-react'

const CourseFeatures = () => {
  const pillars = [
    {
      title: "Learn anything",
      desc: "Explore any interest or trending topic, take prerequisites, and advance your skills.",
      icon: Globe2
    },
    {
      title: "Save money",
      desc: "Spend less on your learning if you plan to take multiple courses this year.",
      icon: ShieldCheck
    },
    {
      title: "Flexible learning",
      desc: "Learn at your own pace, move between courses, or switch to a different program.",
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
