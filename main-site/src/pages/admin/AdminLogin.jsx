import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, Server } from 'lucide-react'
import logo from '../../assets/logo.png'
import Button from '../../components/Button'
import { getApiUrl } from '../../config'

const AdminLogin = () => {
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
      // First try super-admin login (password only)
      const res = await fetch(`${getApiUrl()}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.email || 'admin');
        localStorage.setItem('adminRole', data.role || 'super_admin');
        navigate('/admin');
      } else {
        // If password login fails, try role-based login
        const roleRes = await fetch(`${getApiUrl()}/api/admin/role-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const roleData = await roleRes.json();
        
        if (roleRes.ok && roleData.token) {
          localStorage.setItem('adminToken', roleData.token);
          localStorage.setItem('adminEmail', roleData.email);
          localStorage.setItem('adminRole', roleData.role);
          navigate('/admin');
        } else {
          setError(data.error || roleData.error || 'Access Denied. Invalid Credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('System authentication failure. Connection error.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white border border-slate-100 rounded-[48px] p-10 md:p-16 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block hover:scale-105 transition-transform duration-500">
                <img src={logo} alt="Al-Haq" className="h-20 w-auto mx-auto mb-8 object-contain" />
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-slate-200"></div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-[10px] font-black uppercase tracking-[0.2em] text-brand">
                    <ShieldAlert size={12} /> Secure Portal
                </div>
                <div className="h-px w-8 bg-slate-200"></div>
            </div>
            <h2 className="text-3xl font-black text-brand tracking-tighter uppercase">Admin <span className="text-brand-accent">Login</span></h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-3 px-6">Restricted access protocol</p>
          </div>

          {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-[11px] font-bold mb-8 border border-red-100 flex items-center gap-4 animate-in shake-in duration-300">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Identifier</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-slate-300 group-focus-within:text-brand transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alhaq.pk"
                  className="w-full pl-16 pr-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Token</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-300 group-focus-within:text-brand transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-16 pr-14 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand transition-colors p-2"
                  >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Server size={14} className="opacity-50" />
                    System: <span className="text-emerald-500">Live</span>
                </div>
                <Link to="/login" className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline underline-offset-4">Student Login?</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 bg-brand hover:opacity-90 text-white shadow-xl shadow-brand/20 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <>Authenticate <ArrowRight size={16} /></>}
            </button>
          </form>

          <footer className="mt-12 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 underline decoration-slate-200 underline-offset-8 decoration-dotted decoration-1">Secure Internal System</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
