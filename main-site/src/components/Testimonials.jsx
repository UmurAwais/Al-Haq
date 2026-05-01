import React from 'react'
import { motion } from 'framer-motion'
import TestimonialCard from './TestimonialCard'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Adnan Khan",
      role: "Sub Inspector — Punjab Police",
      text: "Al-Haq's structured preparation made the SI exam feel straightforward. The mock tests were spot-on with the actual paper. Today I wear the uniform with pride — all thanks to this platform.",
      image: "/stories/adnan-khan.webp",
      rating: 5
    },
    {
      name: "Hafiz Muhammad Umair",
      role: "Sub Inspector — Punjab Police",
      text: "From day one, the faculty at Al-Haq guided me with clear goals and real exam strategies. The MCQ bank and daily practice sessions built my confidence step by step until I finally got allocated.",
      image: "/stories/umair.webp",
      rating: 5
    },
    {
      name: "Kishwar Zubair",
      role: "Sub Inspector — Punjab Police",
      text: "As a female candidate competing in a tough field, Al-Haq gave me the edge I needed. The dedicated preparation content and supportive environment helped me achieve my dream posting.",
      image: "/stories/kishwar.webp",
      rating: 5
    },
    {
      name: "Aqsa Shehzadi",
      role: "Sub Inspector — Punjab Police",
      text: "I tried multiple academies before, but nothing compared to the depth and relevance of Al-Haq's material. Their focus on repeated MCQ patterns is what truly sets them apart.",
      image: "/stories/aqsa.webp",
      rating: 5
    },
    {
      name: "Kamran Saleem",
      role: "Excise Inspector — BPS-16",
      text: "The Excise Inspector paper is tricky, but Al-Haq's subject-specific notes made it manageable. I cleared the written test on my first attempt — something I could not have done without this platform.",
      image: "/stories/kamran.webp",
      rating: 5
    },
    {
      name: "Parsa Shabbir",
      role: "Excise Inspector — BPS-16",
      text: "Al-Haq made me believe that hard work paired with the right guidance is unbeatable. Their study plan was realistic, their notes were precise, and the results speak for themselves.",
      image: "/stories/parsa.webp",
      rating: 5
    },
    {
      name: "Faizan Zafar",
      role: "AD Agriculture — BPS-17",
      text: "Getting into BPS-17 feels like a dream come true. Al-Haq's content for Agriculture Officer was comprehensive and exam-focused. I highly recommend this platform to every serious aspirant.",
      image: "/stories/faizan.webp",
      rating: 5
    },
    {
      name: "Sarmad Bilal",
      role: "AD Fisheries — BPS-17",
      text: "The quality of preparation I received at Al-Haq is unmatched. Their analytical approach to every topic, combined with regular assessments, kept me on track throughout my journey.",
      image: "/stories/sarmad.webp",
      rating: 5
    },
    {
      name: "Irfan Farooq",
      role: "ASF — Armed Forces",
      text: "Al-Haq's disciplined approach to exam prep mirrors the discipline required in the Armed Forces. Their test series gave me the mental toughness to excel under pressure on exam day.",
      image: "/stories/irfan.webp",
      rating: 5
    },
    {
      name: "Qazi Husnain",
      role: "AD Rescue 1122 — BPS-17",
      text: "Rescue 1122 selection is highly competitive, but Al-Haq's targeted preparation strategy made all the difference. I cleared every stage confidently and am now proud to serve my community.",
      image: "/stories/husnain.webp",
      rating: 5
    }
  ]

  // Duplicate for seamless loop
  const scrollItems = [...testimonials, ...testimonials]

  return (
    <section id="testimonials" className="pb-24 bg-white relative overflow-hidden">
      <div className="max-w-full mx-auto relative z-10">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
            Real Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Loved by <span className="text-brand">Thousands</span> of Learners
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            See how Al-Haq Hub is helping students across Pakistan crack PPSC and FPSC exams to secure their dream government jobs.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="flex overflow-hidden relative">
          <div 
            className="flex gap-8 animate-marquee hover:[animation-play-state:paused] py-10"
            style={{ width: "max-content" }}
          >
            {scrollItems.map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
