import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = "", 
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 cursor-pointer rounded-full"
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-accent shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    outline: "border-2 border-brand text-brand hover:bg-brand hover:text-white",
    ghost: "text-brand hover:bg-slate-50",
  }
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-4 text-lg",
    xl: "px-12 py-5 text-xl",
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
