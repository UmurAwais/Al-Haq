import Button from './Button'
import { CheckCircle2, Trophy } from 'lucide-react'

const AboutUs = () => {
  return (
    <section id="about" className="pt-6">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist Split Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-24">
          <div className="w-full lg:w-[55%] order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
              Join our global community
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
              Start Your <span className='text-brand-accent'>PPSC</span> Course Today
            </h2>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
              Al-Haq Learning Hub partners with top instructors and institutions to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-14">
              {[
                'World-class content from experts',
                'Earn certificates and degrees',
                'Flexible scheduling that fits',
                'Affordable paths to advancement'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-700 font-semibold text-base">
                  <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-5">
               <Button variant="primary" className="text-base">
                 Join for Free
               </Button>
               <Button variant="secondary" className="text-base">
                 Try for Business
               </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-[45%] order-1 lg:order-2 self-stretch">
            <div className="relative">
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Learning Environment"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Minimal Achievement Badge */}
              <div className="absolute -bottom-4 md:-bottom-8 -left-4 md:-left-8 bg-white p-3 md:p-6 rounded-xl shadow-xl border border-slate-50 flex items-center gap-2 md:gap-4 max-w-[200px] md:max-w-xs transition-all">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <Trophy className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">#1</div>
                  <div className="text-[8px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">LMS Platform in Pakistan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
