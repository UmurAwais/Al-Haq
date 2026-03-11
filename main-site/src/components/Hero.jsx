import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000',
      title: 'Crack <span class="text-transparent bg-clip-text bg-linear-to-r from-white to-brand-accent italic">One-Paper</span> MCQs',
      title_raw: 'Crack One-Paper MCQs',
      description: 'Master PPSC, FPSC, and NTS exams with Pakistan\'s most focused MCQs preparation platform. Join Al-Haq to unlock verified study material and expert techniques.',
      tag: 'Pakistan Exam Prep #1'
    },
    {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000',
      title: 'Elite <span class="text-transparent bg-clip-text bg-linear-to-r from-white to-brand-accent italic">PPSC & FPSC</span> Coaching',
      title_raw: 'Elite PPSC & FPSC Coaching',
      description: 'Learn exactly what examiners look for. From General Knowledge to Pakistan Affairs, get the edge you need to secure your government job.',
      tag: 'Verified Success Rate'
    },
    {
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000',
      title: 'Your <span class="text-transparent bg-clip-text bg-linear-to-r from-white to-brand-accent italic">Govt Job</span> Starts Here',
      title_raw: 'Your Govt Job Starts Here',
      description: 'Get access to 10,000+ top-tier MCQs, mock tests, and video lectures designed specifically for the Pakistani testing landscape.',
      tag: 'Job-Ready Preparation'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [])

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
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
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

      {/* Pagination Dots */}
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
    </section>
  )
}

export default Hero
