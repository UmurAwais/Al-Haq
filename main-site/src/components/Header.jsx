import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Button from './Button'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'

import { useAuth } from '../contexts/AuthContext'

const Header = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Courses', href: '/#courses' },
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
              <span className="hidden lg:block text-2xl font-black tracking-tighter text-brand">
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
            
            <div className="flex items-center gap-2 md:gap-4 border-l border-slate-100 pl-2">
              {user ? (
                <>
                  <Link to="/student/dashboard">
                    <Button variant="ghost" className="px-4! cursor-pointer font-bold text-slate-700">My Learning</Button>
                  </Link>
                  <Link to="/student/profile">
                    <Button variant="primary" className="cursor-pointer px-6!">Profile</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="px-2! cursor-pointer">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" className="cursor-pointer">Get Started</Button>
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
