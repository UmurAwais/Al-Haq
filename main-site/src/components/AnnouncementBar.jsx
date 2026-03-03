import React, { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide bar after scrolling 100px
      if (window.scrollY > 80) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className={`bg-linear-to-r from-brand via-brand-accent to-brand text-white transition-all duration-500 ease-in-out relative z-60 overflow-hidden ${
        isVisible ? 'h-6.75 opacity-100' : 'h-0 opacity-0 pointer-events-none shadow-none'
      }`}
    >
      <div className="max-w-375 mx-auto h-full px-4 flex items-center justify-center gap-4 text-xs md:text-sm font-bold tracking-wide">
        <div className="flex items-center gap-2">
          {/* <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span className="opacity-80 uppercase text-[10px] md:text-xs tracking-widest border-r border-white/20 pr-4 hidden sm:block">Ramadan Special</span> */}
          <span className="truncate">Get 50% Off on all Premium Islamic & Tech Courses!</span>
        </div>
        <a 
          href="#courses" 
          className="flex items-center gap-1.5 group whitespace-nowrap"
        >
          Enroll Now
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-64 h-full bg-white skew-x-12 translate-x-32"></div>
        <div className="absolute top-0 left-0 w-64 h-full bg-white -skew-x-12 -translate-x-32"></div>
      </div>
    </div>
  )
}

export default AnnouncementBar
