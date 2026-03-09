import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft, User, Phone } from 'lucide-react'
import logo from '../assets/logo.png'
import { db } from '../firebaseConfig'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { apiFetch } from '../config'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
          displayName: name,
          phone: phone
        })
      })
      const regData = await regRes.json();

      // 4. MIRROR TO FIRESTORE (for real-time admin sync)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        phone: phone,
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
      navigate('/student/dashboard');
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
        <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 mt-12 mb-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8 pt-4 md:pt-0">
          <img src={logo} alt="Al-Haq LMS" className="h-14 w-auto mx-auto mb-6 object-contain" />
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Join Pakistan's leading digital community</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1 shrink-0"></div>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <User className="w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              </div>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5 w-full">
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

            <div className="space-y-1.5 w-full">
              <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                </div>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 0000000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
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

          <div className="flex items-start gap-2 py-1">
            <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded accent-brand-accent transition-all cursor-pointer" id="terms" />
            <label htmlFor="terms" className="text-xs font-medium text-slate-500 cursor-pointer select-none">
              I agree to the <a href="#" className="text-brand font-bold hover:underline underline-offset-2">Terms</a> and <a href="#" className="text-brand font-bold hover:underline underline-offset-2">Privacy</a>.
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg shadow-brand-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-slate-500">
          Already have an account? <Link to="/login" className="text-brand font-bold hover:underline underline-offset-4 ml-1">Log in here</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
