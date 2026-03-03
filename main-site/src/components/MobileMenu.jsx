import React from 'react'
import SearchBar from './SearchBar'
import Button from './Button'
import NavLinks from './NavLinks'

const MobileMenu = ({ isOpen, onClose, navLinks }) => {
  return (
    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen border-t border-slate-100' : 'max-h-0'}`}>
      <div className="p-4 space-y-6 bg-white shadow-xl">
        {/* Mobile Search */}
        <div className="mb-2">
          <SearchBar />
        </div>

        {/* Mobile Links */}
        <NavLinks links={navLinks} isMobile={true} onLinkClick={onClose} />

        {/* Mobile Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
           <Button variant="secondary" className="w-full py-4" onClick={onClose}>
             Log In
           </Button>
           <Button variant="primary" className="w-full py-4" size="lg" onClick={onClose}>
             Join for Free
           </Button>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
