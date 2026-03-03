import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ className = "" }) => {
  return (
    <div className={`relative w-full group ${className}`}>
      <input 
        type="text" 
        placeholder="What do you want to learn?" 
        className="w-full px-5 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:border-brand focus:ring-[0.1px] focus:ring-brand text-sm transition-all pr-12"
      />
      <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-brand text-white rounded-full hover:bg-brand-accent transition-colors shadow-sm cursor-pointer">
        <Search className="w-4 h-4" />
      </button>
    </div>
  )
}

export default SearchBar
