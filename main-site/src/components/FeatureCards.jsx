import React from 'react'
import { Award, Briefcase, GraduationCap } from 'lucide-react'

const FeatureCards = () => {
  const cards = [
    {
      title: 'PPSC Specialist Prep',
      icon: Award,
      color: 'bg-brand text-white',
      iconColor: 'text-white',
      shapeBg: 'bg-white/10'
    },
    {
      title: 'Crack One-Paper MCQs',
      icon: Briefcase,
      color: 'bg-brand-accent text-white',
      iconColor: 'text-white',
      shapeBg: 'bg-white/10'
    },
    {
      title: 'FPSC & NTS Modules',
      icon: GraduationCap,
      color: 'bg-slate-800 text-white',
      iconColor: 'text-white',
      shapeBg: 'bg-white/10'
    }
  ]

  return (
    <section className="pb-12 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-375 mx-auto">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`${card.color} rounded-3xl p-8 md:p-10 flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-28 md:h-32 hover:-translate-y-1 shadow-lg`}
          >
            <h3 className="text-lg md:text-xl font-bold relative z-10 pr-4 drop-shadow-sm">
              {card.title}
            </h3>
            
            <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
               {/* Translucent background for the icon on solid color cards */}
               <div className={`absolute inset-0 ${card.shapeBg} rounded-[20px] rotate-15 group-hover:rotate-25 transition-transform duration-500`}></div>
               <card.icon className={`${card.iconColor} w-8 h-8 relative z-10 transition-transform group-hover:scale-110 drop-shadow-md`} strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureCards
