import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
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
        <div className="bg-linear-to-r from-brand via-brand/90 to-brand-accent rounded-4xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group">
          {/* Overlay Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/4 relative z-10 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight leading-tight">
              {searchQuery ? 'Found' : 'Learn from'} <span className="opacity-80">{searchQuery ? filteredCourses.length : 'Al-Haq'}</span> {searchQuery ? 'Results' : 'Experts'}
            </h2>
            <div className="flex justify-center lg:justify-start">
                <Button 
                  variant="secondary" 
                  className="px-6 py-3 text-sm flex items-center gap-3"
                  onClick={searchQuery ? onClearSearch : undefined}
                >
                    {searchQuery ? 'Clear Search' : 'Explore courses'} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
          
          {/* Right Cards Grid */}
          <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, i) => (
                <CourseCard key={i} course={course} />
              ))
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
