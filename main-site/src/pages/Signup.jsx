import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User } from 'lucide-react'
import logo from '../assets/logo.png'
import Button from '../components/Button'
import { db } from '../firebaseConfig'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const PORTAL_URL = window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://sparktrainings.vercel.app';

const Signup = () => {
  const [name, setName] = useState('')
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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Update profile name
      await updateProfile(user, { displayName: name })

      // 3. Register in Backend (to generate Reference Number for MongoDB)
      const regRes = await apiFetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: user.uid, 
          email: user.email, 
          displayName: name 
        })
      })
      const regData = await regRes.json();

      // 4. MIRROR TO FIRESTORE (for real-time admin sync)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        referenceNumber: regData.referenceNumber || 'PENDING',
        status: 'active',
        createdAt: serverTimestamp(),
        lastSignIn: serverTimestamp()
      });

      // 4. Set Session (simulating dashboard logic)
      const sessionId = Date.now().toString() + Math.random().toString(36).substring(2)
      await apiFetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, sessionId })
      })
      localStorage.setItem(`session_${user.uid}`, sessionId)

      // 5. Redirect to portal
      window.location.href = `${PORTAL_URL}/student/dashboard`;
    } catch (err) {
      console.error(err)
      setError(err.message.includes('email-already-in-use') 
        ? 'This email is already registered.' 
        : 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-10 left-8 md:left-12 flex items-center gap-2 text-slate-400 hover:text-brand transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Back Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/60 border border-slate-100 mt-12 mb-6">
        <div className="text-center mb-10 pt-4 md:pt-0">
          <img src={logo} alt="Al-Haq" className="h-14 w-auto mx-auto mb-8 object-contain" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 font-medium text-sm mt-3 leading-relaxed">Join Pakistan's leading digital community</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/40 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded-lg accent-brand-accent transition-all cursor-pointer" id="terms" />
            <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 cursor-pointer select-none leading-relaxed">
              I agree to the <a href="#" className="text-brand font-black hover:underline underline-offset-2">Terms</a> and <a href="#" className="text-brand font-black hover:underline underline-offset-2">Privacy</a>.
            </label>
          </div>

          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl bg-brand-accent hover:bg-brand-accent/90 shadow-brand-accent/10 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
          </Button>
        </form>

        <div className="mt-12 text-center text-sm font-medium text-slate-400">
          Already have an account? <Link to="/login" className="text-brand font-black hover:underline underline-offset-4 ml-1">Log in here</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
