import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'
import { apiFetch } from '../config'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Sync session with backend (non-blocking)
      const sessionId = Date.now().toString() + Math.random().toString(36).substring(2)
      apiFetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, sessionId })
      }).catch(err => console.warn('Session sync failed:', err))

      localStorage.setItem(`session_${user.uid}`, sessionId)

      // Redirect to portal
      navigate('/student/dashboard');
    } catch (err) {
      console.error(err)
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-10 left-8 md:left-12 flex items-center gap-2 text-slate-400 hover:text-brand transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <img src={logo} alt="Al-Haq" className="h-16 w-auto mx-auto mb-6 object-contain" />
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Ready to resume your excellence journey?</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1 shrink-0"></div>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center pr-1">
              <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
              <a href="#" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline transition-all">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors"
                >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" className="w-4 h-4 rounded mt-0.5 accent-brand cursor-pointer" id="remember" />
            <label htmlFor="remember" className="text-xs font-medium text-slate-500 cursor-pointer select-none">Remember this session</label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-brand hover:opacity-90 text-white shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link to="/signup" className="text-brand font-bold hover:underline underline-offset-4 ml-1">Join the community</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
