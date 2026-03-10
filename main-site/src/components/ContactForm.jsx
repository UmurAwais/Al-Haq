import React, { useState } from 'react'
import Button from './Button'
import { Mail, MessageSquare, Phone, Send, Loader2, CheckCircle } from 'lucide-react'
import { apiFetch } from '../config'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  // Formspree Config
  const FORMSPREE_ID = "2954164678055427407" 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // 1. Sync to our internal backend first (THE SOURCE OF TRUTH)
      const backendRes = await apiFetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const backendData = await backendRes.json();
      if (!backendData.ok) {
        throw new Error(backendData.message || 'Failed to save inquiry to database');
      }

      // 2. Forward to Formspree for email automation (Optional Notification)
      // Note: If Formspree ID is invalid, we still consider the submission "Done" because it's in our DB.
      try {
        const formspreeRes = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!formspreeRes.ok) {
           console.warn('Formspree notification skipped: ', await formspreeRes.text());
        }
      } catch (fErr) {
        console.error('Formspree connection error (ignoring as DB saved):', fErr);
      }

      // Success!
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });

    } catch (err) {
      console.error('Contact Form Error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (status === 'success') {
    return (
      <section id="contact" className="pb-16 bg-white scroll-mt-20">
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl p-12 md:p-20 border border-slate-100/80 text-center flex flex-col items-center max-w-2xl mx-auto shadow-xl shadow-brand/5">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-100 animate-in zoom-in duration-500">
               <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Message Received!</h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              Thank you for reaching out. We've received your inquiry and one of our advisors will get back to you shortly at <span className="text-slate-900 font-bold">{formData.email}</span>.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="pb-16 bg-white scroll-mt-20">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900 appearance-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Course Support">Course Support</option>
                    <option value="Technical Issue">Technical Issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="w-full px-6 py-4 rounded-3xl bg-white border border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-bold uppercase tracking-tight">
                    <Mail size={16} /> {errorMessage}
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={status === 'loading'}
                  variant="primary" 
                  className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand/10 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {status === 'loading' ? (
                    <>Sending Message <Loader2 className="w-5 h-5 animate-spin" /></>
                  ) : (
                    <>Send Message <Send className="w-5 h-5" /></>
                  )}
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
