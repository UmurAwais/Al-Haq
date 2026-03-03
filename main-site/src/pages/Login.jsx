import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, Eye, ArrowRight } from 'lucide-react'
import logo from '../assets/logo.png'
import Button from '../components/Button'

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-10 left-8 md:left-12 flex items-center gap-2 text-slate-400 hover:text-brand transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Back Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100">
        <div className="text-center mb-10">
          <img src={logo} alt="Al-Haq" className="h-16 w-auto mx-auto mb-8 object-contain" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium text-sm mt-3">Ready to resume your excellence journey?</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center pr-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <a href="#" className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] hover:opacity-80">Forgot?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900" 
              />
              <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" className="w-5 h-5 rounded-lg accent-brand cursor-pointer" id="remember" />
            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Remember this session</label>
          </div>

          <Button 
            variant="primary" 
            className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand/10 hover:-translate-y-1 active:scale-[0.98] transition-all"
          >
            Sign In <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="mt-12 text-center text-sm font-medium text-slate-400">
          Don't have an account? <Link to="/signup" className="text-brand font-black hover:underline underline-offset-4 ml-1">Join the community</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
