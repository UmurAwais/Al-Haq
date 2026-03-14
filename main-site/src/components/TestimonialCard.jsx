import React from 'react'
import { Quote, Star } from 'lucide-react'

const TestimonialCard = ({ item }) => {
  return (
    <div className="w-87.5 shrink-0 group/card bg-white p-10 rounded-3xl border border-slate-100/80 shadow-xs hover:shadow-2xl transition-all duration-500 relative flex flex-col items-center text-center">
      {/* Quote Icon */}
      <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-brand group-hover/card:scale-110 transition-transform">
        <Quote className="w-6 h-6 fill-brand opacity-10" />
      </div>

      <div className="mb-8 relative">
        <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm group-hover/card:border-brand/20 transition-all duration-500">
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

      <p className="text-slate-600 leading-relaxed font-medium italic line-clamp-4">
        "{item.text}"
      </p>
    </div>
  )
}

export default TestimonialCard
