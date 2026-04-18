import React, { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, BookOpen, UserCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Button from './Button'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'

import { useAuth } from '../contexts/AuthContext'

const Header = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Courses', href: '/#courses' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'About Us', href: '/#about' },
    { name: 'Contact Us', href: '/#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-375 mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="shrink-0 cursor-pointer flex items-center">
              <img src={logo} alt="Al-Haq Logo" className="h-21.25 w-auto object-contain" />
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-brand">
                Al-<span className='text-brand-accent'>Haq</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavLinks links={navLinks} className="hidden lg:flex" />
          </div>

          {/* Right Side - Search & Actions */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:block w-80">
              <SearchBar value={searchQuery} onChange={onSearchChange} onSubmit={onSearchSubmit} />
            </div>
            
            <div className="hidden lg:flex items-center gap-2 md:gap-4 border-l border-slate-100 pl-4">
              {user ? (
                <div className="relative group py-2">
                  <div className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Student</p>
                      <p className="text-xs font-bold text-brand leading-none truncate max-w-30">{user.displayName || 'Me'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-0.5 group-hover:border-brand-accent/30 transition-all duration-300">
                      <img 
                        src={user.photoURL || user.profilePicture || `https://ui-avatars.com/api/?name=${user.displayName || 'Student'}&background=f1f5f9&color=07102e&bold=true`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    </div>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-60">
                    <div className="w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-brand/10 overflow-hidden font-sans">
                      <div className="p-5 border-b border-slate-50 bg-slate-50/30">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center text-brand font-black text-sm">
                             {(user.displayName || 'S').charAt(0).toUpperCase()}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-brand truncate">{user.displayName || 'Student'}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{user.email}</p>
                           </div>
                        </div>
                        <Link to="/student/dashboard" className="w-full block">
                           <Button variant="primary" className="w-full py-2.5! text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20">Dashboard</Button>
                        </Link>
                      </div>
                      
                      <div className="p-2.5">
                        <Link to="/student/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-brand transition-all group/item">
                          <BookOpen className="w-4 h-4 text-slate-400 group-hover/item:text-brand" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">My Learning</span>
                        </Link>
                        <Link to="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-brand transition-all group/item">
                          <UserCircle className="w-4 h-4 text-slate-400 group-hover/item:text-brand" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                        </Link>
                      </div>

                      <div className="p-2.5 border-t border-slate-50">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all group/item cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-slate-400 group-hover/item:text-red-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="px-2! cursor-pointer font-bold text-slate-500 hover:text-brand uppercase tracking-widest text-[10px]">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" className="cursor-pointer px-8! py-3! font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand/10">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        navLinks={navLinks} 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
    </header>
  )
}

export default Header
