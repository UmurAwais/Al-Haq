import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Button from './Button'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Courses', href: '#courses' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-375 mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Nav */}
          <div className="flex items-center gap-10">
            <a href="#home" className="shrink-0">
              <img src={logo} alt="Al-Haq Logo" className="h-21.25 w-auto object-contain" />
            </a>

            {/* Desktop Navigation */}
            <NavLinks links={navLinks} className="hidden lg:flex" />
          </div>

          {/* Right Side - Search & Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-100">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-100 pl-2">
              <Button variant="ghost" className="px-2!">Log In</Button>
              <Button variant="primary">Get Started</Button>
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
      />
    </header>
  )
}

export default Header
