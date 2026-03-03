import React from 'react'
import { Quote, Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ali Hamza",
      role: "PPSC Candidate",
      text: "Al-Haq Learning Hub is the only platform that provides such deep insights into the PPSC General Ability syllabus. The expert-led videos are a game-changer for anyone serious about their career.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Sarah Ahmed",
      role: "Cyber Security Analyst",
      text: "Coming from a non-tech background, I was worried about the complexity. But the way Al-Haq simplifies technical concepts is amazing. I'm now working as an entry-level analyst!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Omar Farooq",
      role: "Masters Student",
      text: "The Islamic Finance course offered here is unparalleled. It covers the modern financial landscape while staying true to our principles. Highly recommended for every university student.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 4
    }
  ]

  return (
    <section id="testimonials" className="pb-24 bg-white relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-accent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
            Real Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Loved by <span className="text-brand">Thousands</span> of Learners
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Discover how Al-Haq Hub has helped students across Pakistan and beyond achieve their professional and academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div 
              key={i} 
              className="group bg-white p-10 rounded-3xl border border-slate-100/80 shadow-xs hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center"
            >
              {/* Quote Icon */}
              <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                <Quote className="w-6 h-6 fill-brand opacity-10" />
              </div>

              <div className="mb-8 relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm group-hover:border-brand/20 transition-all duration-500">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-50">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-sm font-semibold text-brand/60 uppercase tracking-widest mb-6">{item.role}</p>

              <div className="flex gap-1 mb-6">
                 {[...Array(5)].map((_, starIdx) => (
                   <Star key={starIdx} className={`w-3 h-3 ${starIdx < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                 ))}
              </div>

              <p className="text-slate-600 leading-relaxed font-medium italic">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
