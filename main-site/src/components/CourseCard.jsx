import React from 'react'
import { Star } from 'lucide-react'

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white flex flex-col p-2 h-full rounded-[18px] group cursor-pointer transition-all duration-300">
      {/* 1. Thumbnail - Udemy style (minimalistic) */}
      <div className="relative aspect-video mb-2.5 overflow-hidden border border-slate-100 rounded-[14px]">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
        />
        {course.bestseller && (
          <div className="absolute top-2 left-2 bg-[#eceb98] text-[#3d3c0a] text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
            Bestseller
          </div>
        )}
      </div>

      {/* 2. Content Area - Udemy Typography */}
      <div className="flex flex-col grow px-0.5">
        <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-1 line-clamp-2 h-10">
          {course.title}
        </h3>
        
        <p className="text-[12px] text-slate-500 mb-1 truncate">
          {course.author || 'Al-Haq Expert'}
        </p>

        {/* 3. Rating Area */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[13px] font-bold text-[#b4690e]">{course.rating}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-[#b4690e] text-[#b4690e]' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <span className="text-[12px] text-slate-400">({course.reviews})</span>
        </div>

        {/* 4. Pricing Area - Udemy Style Discount */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">{course.price}</span>
          {course.oldPrice && (
            <span className="text-[13px] text-slate-500 line-through opacity-60 font-medium">
              {course.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
