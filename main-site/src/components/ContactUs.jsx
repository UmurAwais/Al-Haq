import React from 'react'
import Button from './Button'
import { Sparkles } from 'lucide-react'

const ContactUs = () => {
  return (
    <section id="contact" className="pb-24">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-brand to-brand-accent rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl shadow-brand/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.25em] mb-10 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-4 h-4 text-brand-accent animate-spin-slow" />
              Limited Time Opportunity
            </div>

            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Start Your <span className="text-brand-accent">Excellence</span> Journey Today
            </h2>
            
            <p className="text-white/70 text-lg md:text-2xl font-medium mb-12 leading-relaxed px-4">
              Join over <span className="text-white font-black underline decoration-brand-accent/40 decoration-4 underline-offset-4">50,000+ graduates</span> who have transformed their careers with Al-Haq Learning Hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                variant="secondary" 
                size="xl" 
                className="w-full sm:w-auto px-12 py-6 text-lg font-black shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
              >
                Enroll Now — Save 40%
              </Button>
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
                No credit card required to start
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
