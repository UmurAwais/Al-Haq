import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import SearchBar from './SearchBar'
import Button from './Button'
import NavLinks from './NavLinks'

import { useAuth } from '../contexts/AuthContext'

const MobileMenu = ({ isOpen, onClose, navLinks, searchQuery, onSearchChange, onSearchSubmit }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/login')
  }

  return (
    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen border-t border-slate-100' : 'max-h-0'}`}>
      <div className="p-4 space-y-6 bg-white shadow-xl">
        {/* Mobile Search */}
        <div className="mb-2">
          <SearchBar 
            value={searchQuery} 
            onChange={onSearchChange} 
            onSubmit={() => {
              onSearchSubmit?.();
              onClose();
            }} 
          />
        </div>

        {/* Mobile Links */}
        <NavLinks links={navLinks} isMobile={true} onLinkClick={onClose} />

        {/* Mobile Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
           {user ? (
             <>
               <Link to="/student/dashboard" onClick={onClose}>
                 <Button variant="secondary" className="w-full py-4 text-sm font-black uppercase tracking-widest">
                   My Learning
                 </Button>
               </Link>
               <Link to="/student/profile" onClick={onClose}>
                 <Button variant="secondary" className="w-full py-4 text-sm font-black uppercase tracking-widest">
                   My Profile
                 </Button>
               </Link>
               <Button 
                variant="primary" 
                onClick={handleLogout}
                className="w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 Logout <LogOut className="w-4 h-4" />
               </Button>
             </>
           ) : (
             <>
               <Link to="/login" onClick={onClose}>
                 <Button variant="secondary" className="w-full py-4 text-sm font-black uppercase tracking-widest">
                   Log In
                 </Button>
               </Link>
               <Link to="/signup" onClick={onClose}>
                 <Button variant="primary" className="w-full py-4 text-sm font-black uppercase tracking-widest" size="lg">
                   Join for Free
                 </Button>
               </Link>
             </>
           )}
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
