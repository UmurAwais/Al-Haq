import React from 'react'

const NavLinks = ({ links, isMobile = false, onLinkClick, className = "" }) => {
  if (isMobile) {
    return (
      <nav className={`flex flex-col gap-1 ${className}`}>
        {links.map((link) => (
          <a 
            key={link.name}
            href={link.href} 
            onClick={onLinkClick}
            className="text-slate-700 font-bold py-3 px-4 hover:text-brand hover:bg-slate-50 transition-all rounded-xl tracking-wide text-sm border-b border-transparent"
          >
            {link.name}
          </a>
        ))}
      </nav>
    )
  }

  return (
    <nav className={`flex items-center gap-8 ${className}`}>
      {links.map((link) => (
        <a 
          key={link.name}
          href={link.href} 
          className="hover:text-brand-accent text-brand font-semibold text-[16px] transition-colors tracking-wide"
        >
          {link.name}
        </a>
      ))}
    </nav>
  )
}

export default NavLinks
