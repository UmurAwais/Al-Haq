import React from 'react'
import { ArrowRight } from 'lucide-react'
import CourseCard from './CourseCard'
import Button from './Button'

const FeaturedCourses = () => {
  const courses = [
    {
      title: 'PPSC General Ability Expert 2024',
      author: 'Dr. Usman Ghani',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      rating: '4.8',
      reviews: '1,240',
      price: '$49.99',
      oldPrice: '$99.99',
      bestseller: true
    },
    {
      title: 'The Complete Cyber Security Course: Network Security',
      author: 'Nathan House',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
      rating: '4.9',
      reviews: '3,150',
      price: '$89.99',
      oldPrice: '$129.99',
      bestseller: true
    },
    {
      title: 'Machine Learning A-Z™: Hands-On Python & R',
      author: 'Kirill Eremenko',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
      rating: '4.7',
      reviews: '2,800',
      price: '$99.99',
      oldPrice: '$199.99',
      bestseller: false
    },
    {
      title: 'Islamic Finance: Principles and Practices',
      author: 'Prof. Ahmed Khan',
      image: 'https://images.unsplash.com/photo-1544161515-4af6b1d462c2?auto=format&fit=crop&q=80&w=800',
      rating: '4.8',
      reviews: '980',
      price: '$59.99',
      oldPrice: '$89.99',
      bestseller: false
    }
  ]

  return (
    <section id='courses' className="pb-24">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-brand via-brand/90 to-brand-accent rounded-4xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group">
          {/* Overlay Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/4 relative z-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight leading-tight">
              Learn from <span className="opacity-80">Al-Haq</span> Experts
            </h2>
            <div className="flex justify-center lg:justify-start">
                <Button variant="secondary" className="px-6 py-3 text-sm flex items-center gap-3">
                    Explore courses <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
          
          {/* Right Cards Grid */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10">
            {courses.map((course, i) => (
              <CourseCard key={i} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses
