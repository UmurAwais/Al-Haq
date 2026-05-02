import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, Server } from 'lucide-react'
import logo from '../../assets/logo.png'
import Button from '../../components/Button'
import { apiFetch } from '../../config'

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
      const res = await apiFetch('/api/admin/login', {
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
        const roleRes = await apiFetch('/api/admin/role-login', {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden admin-dashboard">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
            <Link to="/" className="inline-block hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="Al-Haq LMS" className="h-16 w-auto mx-auto mb-6 object-contain" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Admin Workspace</h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Log in to manage the Al-Haq learning platform.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100 flex items-start gap-3">
                  <ShieldAlert size={16} className="mt-0.5 shrink-0" />
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
                  placeholder="admin@alhaq.pk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" 
                />
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-600">System Online</span>
                </div>
                <Link to="/login" className="text-xs font-bold text-brand hover:underline underline-offset-4 transition-all">Go to Student Login</Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-brand hover:opacity-90 text-white shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Log in to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
