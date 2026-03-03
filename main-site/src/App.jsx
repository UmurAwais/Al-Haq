import React from 'react'
import { ArrowRight, GraduationCap, Lightbulb, Rocket, Users, Zap } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import Button from './components/Button'
import Hero from './components/Hero'
import FeatureCards from './components/FeatureCards'
import AnnouncementBar from './components/AnnouncementBar'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 scroll-smooth">
      <AnnouncementBar />
      <Header />
      
      <main className="overflow-hidden">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Constrained Hero */}
          <Hero />

          <FeatureCards />

          {/* About Us Section */}
          <section id="about" className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">About Us</h2>
              <div className="w-24 h-1.5 bg-linear-to-r from-brand to-brand-accent mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Interactive Learning', desc: 'Engage with dynamic content, collaborative projects, and live sessions.', icon: GraduationCap },
                { title: 'Industry Experts', desc: 'Learn directly from veterans with real-world experience and deep insights.', icon: Lightbulb },
                { title: 'Lifetime Access', desc: 'Enroll once and access your course materials anytime, anywhere, forever.', icon: Rocket }
              ].map((feature, i) => (
                <div key={i} className="p-10 bg-white rounded-4xl border border-slate-100/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group overflow-hidden relative">
                  <div className="mb-6 relative z-10 w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 relative z-10 group-hover:text-brand transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed relative z-10">
                    {feature.desc}
                  </p>
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Courses Section */}
          <section id="courses" className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="flex justify-between items-end mb-16">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Explore Our Most <span className="text-brand">Popular</span> Courses</h2>
                <p className="text-slate-500 text-lg">Master in-demand skills with our comprehensive curriculum designed by industry professionals.</p>
              </div>
              <Button variant="secondary" className="hidden md:flex">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Full-Stack Web Development', category: 'Tech', level: 'Beginner', price: '$89.99', students: '12K', img: '/api/placeholder/400/250' },
                { title: 'UI/UX Design Mastery', category: 'Design', level: 'Intermediate', price: '$74.99', students: '8K', img: '/api/placeholder/400/250' },
                { title: 'Data Science Bootcamp', category: 'Data', level: 'Advanced', price: '$94.99', students: '5K', img: '/api/placeholder/400/250' }
              ].map((course, i) => (
                <div key={i} className="bg-white rounded-4xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer">
                  <div className="h-56 bg-slate-200 relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">{course.category}</div>
                    <div className="w-full h-full bg-linear-to-tr from-slate-100 to-slate-200 group-hover:scale-110 transition-transform duration-700"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} Students
                      </span>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-6 line-clamp-2 group-hover:text-brand transition-colors leading-snug">{course.title}</h3>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                      <span className="text-2xl font-black text-slate-900">{course.price}</span>
                      <button className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all transform group-hover:rotate-45">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="bg-slate-900 rounded-[48px] p-12 md:p-24 relative overflow-hidden">
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="text-blue-500 text-6xl mb-8">“</div>
                <p className="text-white text-2xl md:text-4xl font-medium mb-12 leading-relaxed">
                  Al-Haq Learning Hub has completely transformed how I learn. The instructors are top-notch and the community support is unparalleled. I landed my dream job within 3 months!
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-brand rounded-full mb-4"></div>
                  <div className="text-white font-bold text-xl">Sarah Johnson</div>
                  <div className="text-slate-400">Senior UI/UX Designer</div>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
            </div>
          </section>

          {/* Contact Us Section */}
          <section id="contact" className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="bg-linear-to-br from-brand to-brand-accent rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Contact Us</h2>
                <p className="text-brand/20 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                  Have questions? Ready to start your journey? Join our community of over 50,000 students and start learning today.
                </p>
                <Button variant="secondary" size="xl" className="shadow-2xl shadow-black/20 hover:-translate-y-1">
                  Claim My Discount
                </Button>
              </div>
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-black/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App