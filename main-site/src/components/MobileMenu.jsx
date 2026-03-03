import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import Button from './Button'
import NavLinks from './NavLinks'

const MobileMenu = ({ isOpen, onClose, navLinks, searchQuery, onSearchChange, onSearchSubmit }) => {
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
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
