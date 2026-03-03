import React from 'react'
import Button from './Button'
import { Mail, MessageSquare, Phone, Send } from 'lucide-react'

const ContactForm = () => {
  return (
    <section id="contact" className="pb-16 bg-white">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Info Column */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
              Get in <span className="text-brand">Touch</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              Have a specific question or need guidance? Our team of experts is here to help you navigate your learning journey.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-brand/5 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-0.5">Email Us</div>
                  <div className="text-lg font-bold text-slate-900">support@alhaq.pk</div>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-brand/5 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-0.5">Call Support</div>
                  <div className="text-lg font-bold text-slate-900">+92 300 1234567</div>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-brand/5 text-brand rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-0.5">WhatsApp</div>
                  <div className="text-lg font-bold text-slate-900">Chat with an advisor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="w-full lg:w-2/3">
            <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100/80">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Subject</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900 appearance-none">
                    <option>General Inquiry</option>
                    <option>Course Support</option>
                    {/* <option>Business Partnership</option> */}
                    <option>Technical Issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    rows="4"
                    placeholder="Tell us how we can help..."
                    className="w-full px-6 py-4 rounded-3xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand/10 hover:-translate-y-1 transition-all"
                >
                  Send Message <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
