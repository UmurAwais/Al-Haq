import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const CTA = () => {
  return (
    <section className="bg-brand py-20 px-4 sm:px-6 lg:px-14">
      <div className="max-w-375 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Take the next step toward your <span className="text-brand-accent">personal</span> and professional goals with Al-Haq.
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Join now to receive personalized recommendations from the Al-Haq Learning Hub expert team.
            </p>
          </div>
          
          <div className="shrink-0">
            <Link to="/signup">
              <Button 
                variant="primary" 
                size="xl" 
                className="px-12 py-6 text-xl font-extrabold bg-brand-accent text-white border-0 hover:bg-brand-accent/90 shadow-2xl shadow-black/20 cursor-pointer transition-all hover:-translate-y-1 active:scale-95"
              >
                Join for Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Coursera-style Trust Metrics - Professional Stat Display */}
        <div className="mt-20 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "50,000+", sub: "Learners across Pakistan" },
            { label: "100+", sub: "Verified Expert Courses" },
            { label: "15+", sub: "Institutional Partners" },
            { label: "4.8/5", sub: "User Satisfaction Score" }
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left group cursor-default">
              <div className="text-3xl font-black text-white mb-1 group-hover:text-brand-accent transition-colors">{stat.label}</div>
              <div className="text-sm font-medium text-white/50 leading-snug">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CTA
