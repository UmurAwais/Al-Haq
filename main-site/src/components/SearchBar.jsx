import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, onSubmit, className = "" }) => {
  const courses = [
    "PPSC General Ability Expert 2024",
    "The Complete Cyber Security Course: Network Security",
    "Machine Learning A-Z™: Hands-On Python & R",
    "Islamic Finance: Principles and Practices"
  ]

  const suggestions = value 
    ? courses.filter(c => c.toLowerCase().includes(value.toLowerCase()))
    : []

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.();
    }
  }

  return (
    <div className={`relative w-full group ${className}`}>
      <div className="relative z-20">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to learn?" 
          className="w-full px-5 py-2.5 rounded-full border border-slate-300 bg-white focus:outline-none focus:border-brand focus:ring-[0.1px] focus:ring-brand text-sm transition-all pr-12"
        />
        <button 
          onClick={() => onSubmit?.()}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-brand text-white rounded-full hover:bg-brand-accent transition-colors shadow-sm cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Results Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-slate-50">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommended Courses</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((item, i) => (
              <button 
                key={i}
                onClick={() => {
                  onChange(item);
                  onSubmit?.();
                }}
                className="w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
              >
                <span className="truncate pr-4">{item}</span>
                <span className="text-[10px] font-black text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">QUICK VIEW</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
