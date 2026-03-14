import { Link, useNavigate } from 'react-router-dom'
import { Star, ShieldCheck } from 'lucide-react'
import Button from './Button'
import { useCart } from '../contexts/CartContext'

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  return (
    <Link to={`/course/${course.id}`} className="block group h-full">
      <div className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col h-full group hover:shadow-2xl transition-all duration-300">
      {/* 1. Thumbnail */}
      <div className="relative aspect-16/10 mb-4 overflow-hidden rounded-xl">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* 2. Badge Wrapper */}
      <div className="mb-3">
        <div className="inline-flex items-center gap-1.5 bg-[#5022C3] text-white px-3 py-1.5 rounded-full shadow-sm shadow-brand/10">
          <ShieldCheck size={14} className="stroke-3" />
          <span className="text-[11px] font-black uppercase tracking-tight">
            {course.badgeLabel || 'Premium • Online'}
          </span>
        </div>
      </div>

      {/* 3. Content Area */}
      <div className="flex flex-col grow">
        <h3 className="text-[20px] font-black text-[#0F172A] leading-[1.2] line-clamp-2 mb-2">
          {course.title}
        </h3>
        
        <p className="text-[13px] text-[#64748B] mb-2 line-clamp-2 leading-relaxed">
          {course.excerpt || course.description || 'Master this course with expert-led training and real-world projects.'}
        </p>

        {/* 4. Pricing */}
        <div className="mb-1 flex flex-row justify-between">
          <span className="text-[22px] font-black text-[#0F172A] tracking-tight">
            {String(course.price || '').startsWith('Rs') ? course.price : `Rs. ${course.price}`}
          </span>

          <div className="flex items-center gap-1">
            <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-[14px] font-black text-[#0F172A]">{course.rating || '4.5'}</span>
          </div>

          
          <div className="px-2.5 py-1 rounded-lg border border-slate-100 bg-[#F8FAFC] text-[12px] text-[#64748B] font-bold flex items-center">
            {course.reviews || '0'}
          </div>
        </div>

        {/* 5. Stats Row */}
        <div className="flex items-center gap-2 mb-6">
          
          
        </div>

        {/* 6. Action Button */}
        <div className="mt-auto">
           <Button 
             variant="primary" 
             className="w-full rounded-xl py-3.5 text-[15px] font-black shadow-lg shadow-brand/20"
             onClick={(e) => {
               e.preventDefault();
               addToCart(course);
               navigate('/cart');
             }}
           >
             Enroll now
           </Button>
        </div>
      </div>
      </div>
    </Link>
  )
}

export default CourseCard
