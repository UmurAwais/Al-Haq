import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2, GraduationCap, Trophy } from 'lucide-react'
import CourseCard from './CourseCard'
import Button from './Button'
import { apiFetch, getApiUrl } from '../config'

const FeaturedCourses = ({ searchQuery = '', onClearSearch }) => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const staticCourses = [
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiFetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          const baseUrl = getApiUrl().replace(/\/$/, '')
          const mapped = data.map(course => ({
            title: course.title,
            author: course.instructor || course.author || 'Al-Haq Expert',
            image: course.image?.startsWith('http') ? course.image : (course.image ? `${baseUrl}${course.image.startsWith('/') ? '' : '/'}${course.image}` : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'),
            rating: course.rating || '4.8',
            reviews: course.ratingCount || course.reviews || '100+',
            price: String(course.price || '').toLowerCase() === 'free' ? 'Free' : (String(course.price || '').startsWith('Rs') ? course.price : `Rs. ${course.price}`),
            oldPrice: course.originalPrice ? `Rs. ${course.originalPrice}` : null,
            bestseller: course.bestseller || course.badge?.label?.toLowerCase().includes('best') || false,
            id: course.slug || course.id || course._id
          }))
          setCourses(mapped.length > 0 ? mapped : staticCourses)
        } else {
          setCourses(staticCourses)
        }
      } catch (err) {
        setCourses(staticCourses)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  if (loading) {
    return (
        <section id='courses' className="pb-24 flex items-center justify-center min-h-100">
            <Loader2 className="w-12 h-12 text-brand animate-spin opacity-20" />
        </section>
    )
  }

  const filteredCourses = (courses.length > 0 ? courses : staticCourses).filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section id='courses' className="pb-24 scroll-mt-24">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-brand via-brand/90 to-brand-accent rounded-4xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-8 relative overflow-hidden group">
          {/* Overlay Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          {/* Left Text Content */}
          <div className="w-full lg:max-w-md relative z-10 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              {searchQuery ? 'Found' : 'Learn from'} <span className="opacity-80">{searchQuery ? filteredCourses.length : 'Al-Haq'}</span> {searchQuery ? 'Results' : 'Experts'}
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-10 max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
              Master the art of competitive exams with Pakistan's most focused MCQ preparation material. Join thousands of candidates who have already secured their future.
            </p>
            <div className="flex justify-center lg:justify-start">
                <Button 
                  variant="secondary" 
                  className="px-8 py-3.5 text-sm font-bold flex items-center gap-3 shadow-xl"
                  onClick={searchQuery ? onClearSearch : undefined}
                >
                    {searchQuery ? 'Clear Search' : 'Explore courses'} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
          
          {/* Decorative Divider Icon - The "Success Bridge" */}
          <div className="hidden lg:flex flex-col items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity translate-x-4">
             <div className="w-px h-20 bg-linear-to-b from-transparent via-white to-transparent"></div>
             <div className="p-3 rounded-full border border-white/40 shadow-inner">
                 <Trophy className="w-8 h-8 text-white animate-pulse" />
             </div>
             <div className="w-px h-20 bg-linear-to-t from-transparent via-white to-transparent"></div>
          </div>
          
          {/* Right Cards Grid */}
          <div className="w-full lg:max-w-md relative z-10">
            {filteredCourses.length > 0 ? (
              <CourseCard course={filteredCourses[0]} />
            ) : (
              <div className="col-span-full py-20 text-center">
                 <p className="text-white/60 font-bold text-xl italic">No courses found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses
