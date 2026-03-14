import React from 'react'
import { motion } from 'framer-motion'
import TestimonialCard from './TestimonialCard'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ali Hamza",
      role: "PPSC Aspirant",
      text: "The best place for PPSC General Ability. The MCQ patterns and daily mock tests helped me understand exactly how the examiner thinks. I passed my screening test comfortably!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Sana Malik",
      role: "FPSC Candidate",
      text: "I was struggling with Pakistan Affairs and Current Affairs, but Al-Haq's simplified notes and video lectures made everything so clear. The focus on one-paper MCQs is unmatched.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Usman Ghani",
      role: "Govt Job Applicant",
      text: "Joining the Al-Haq Hub was the best decision for my prep. Their test-taking strategies for PPSC are a goldmine. Highly recommend it to anyone aiming for a 16th or 17th scale job.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Fatima Noor",
      role: "NTS Success",
      text: "The MCQ bank is incredibly relevant. I found almost 70% of the questions in my actual test were similar to what I practiced here. Truly a game-changer for aspirants.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Ahmed Raza",
      role: "PPSC Inspector",
      text: "I finally cleared my test after three attempts, thanks to the targeted approach of Al-Haq. Their focus on the most repeated questions saved me so much time.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
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
