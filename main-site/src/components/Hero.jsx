import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const slides = [
    {
      desktop: '/bannerdesktop2.jpeg',
      mobile: '/bannermobile2.jpeg',
      title: 'Crack <span class="text-transparent bg-clip-text bg-linear-to-r from-white to-brand-accent italic">One-Paper</span> MCQs',
      description: 'Master PPSC, FPSC, and NTS exams with Pakistan\'s most focused MCQs preparation platform. Join Al-Haq to unlock verified study material and expert techniques.',
      tag: 'Pakistan Exam Prep #1'
    },
    {
      desktop: '/bannerdesktop.jpeg',
      mobile: '/bannermobile.jpeg',
      title: 'Expert Led <span class="text-transparent bg-clip-text bg-linear-to-r from-white to-brand-accent italic">Preparation</span>',
      description: 'Join thousands of successful candidates who prepared with Al-Haq. Get access to premium test series and comprehensive study notes.',
      tag: 'Success Guaranteed'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section id="home" className="relative h-112.5 md:h-137.5 overflow-hidden rounded-[18px] mt-2">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ 
              backgroundImage: `url(${slide.desktop})`,
            }}
          >
            <div className="absolute inset-0"></div>
          </div>
          <div 
            className="absolute inset-0 bg-cover md:bg-center bg-top block md:hidden"
            style={{ 
              backgroundImage: `url(${slide.mobile})`,
            }}
          >
            <div className="absolute inset-0"></div>
          </div>

          {/* Content */}
          {/* <div className="relative h-full max-w-375 mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-20 md:py-32">
            <div className={`max-w-3xl transition-all duration-700 delay-300 ${
              index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
            }`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-widest mb-10 uppercase border border-white/20">
                <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                {slide.tag}
              </div>
              <h1 
                className="text-5xl md:text-8xl font-black text-white tracking-tight mb-10 leading-[1.05]"
                dangerouslySetInnerHTML={{ __html: slide.title }}
              ></h1>
              <p className="text-lg md:text-2xl text-white/90 max-w-2xl mb-14 leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button variant="primary" size="xl" className="bg-white text-brand! hover:bg-brand-accent! hover:text-white! shadow-2xl transition-all">
                  Join for Free
                </Button>
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10 hover:border-white transition-all">
                  Explore Courses
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      ))}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 right-4 sm:right-6 lg:right-8 flex items-center gap-4 z-20">
          <button 
            onClick={prevSlide}
            className="p-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-brand-accent hover:border-brand-accent transition-all cursor-pointer group"
          >
            <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-brand-accent hover:border-brand-accent transition-all cursor-pointer group"
          >
            <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
          </button>
        </div>
      )}

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-brand-accent' 
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
            ></button>
          ))}
        </div>
      )}
    </section>
  )
}

export default Hero
