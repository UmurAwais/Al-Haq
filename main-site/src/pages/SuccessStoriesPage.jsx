import React, { useEffect, useState } from 'react'
import { Trophy, Award, CheckCircle2, Star, ArrowLeft, ShieldCheck, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AnnouncementBar from '../components/AnnouncementBar'
import SuccessCard from '../components/SuccessCard'

const SuccessStoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allStories = [
    {
      name: "Ahmed Raza",
      exam: "PPSC One-Paper",
      achievement: "Allocated as AD-IB",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      dept: "Intelligence Bureau"
    },
    {
      name: "Zainab Fatima",
      exam: "FPSC Inspector",
      achievement: "Posted in FIA",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      dept: "Federal Investigation Agency"
    },
    {
      name: "Muhammed Bilal",
      exam: "PPSC Lecturer",
      achievement: "Allocated in Higher Ed",
      year: "2023",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      dept: "Higher Education Department"
    },
    {
      name: "Iqra Aziz",
      exam: "FPSC Assistant",
      achievement: "Allocated in MOD",
      year: "2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      dept: "Ministry of Defence"
    },
    {
      name: "Usama Pervez",
      exam: "PPSC Tehsildar",
      achievement: "Posted in Revenue",
      year: "2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      dept: "Revenue Department"
    },
    {
      name: "Maria Qureshi",
      exam: "FPSC Custom Officer",
      achievement: "Allocated in FBR",
      year: "2023",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
      dept: "Federal Board of Revenue"
    },
    {
        name: "Hassan Ali",
        exam: "PPSC Sub-Inspector",
        achievement: "Posted in Punjab Police",
        year: "2024",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        dept: "Punjab Police"
    },
    {
        name: "Nimra Sheikh",
        exam: "FPSC Appraising Officer",
        achievement: "Allocated in Customs",
        year: "2023",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
        dept: "Pakistan Customs"
    }
  ]

  const filteredStories = allStories.filter(story => 
    story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.achievement.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AnnouncementBar />
      <Header />

      <main className="pb-24">
        {/* Simple Header Section - White & Clean */}
        <div className="bg-white border-b border-slate-200 py-12 sm:py-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
                </Link>
                
                <div className="max-w-4xl space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                        Our Serving <span className="text-brand">Alumni</span>
                    </h1>
                    <p className="text-xl text-slate-600 font-medium">
                        Explore the verified success records of Al-Haq students who achieved final allocations in PPSC, FPSC, and other departmental exams.
                    </p>
                </div>
             </div>
        </div>

        {/* Search Bar - Google Style */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
            <div className="max-w-2xl mx-auto">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, department, or exam..."
                        className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium text-slate-900"
                    />
                </div>
            </div>
        </div>

        {/* Minimalist Stats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Allocated', value: '500+', icon: CheckCircle2, color: 'text-brand' },
                    { label: 'PPSC Merit', value: '320+', icon: Award, color: 'text-brand' },
                    { label: 'FPSC Officers', value: '180+', icon: ShieldCheck, color: 'text-brand' },
                    { label: 'Success Ratio', value: '85%', icon: Star, color: 'text-brand' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-brand/10 transition-colors">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 ${stat.color} group-hover:bg-brand group-hover:text-white transition-all`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Main Roster Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Detailed Candidate Roster</h2>
                <div className="h-1.5 w-20 bg-brand rounded-full"></div>
            </div>

            {filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredStories.map((story, i) => (
                        <SuccessCard key={i} story={story} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Matching Records</h3>
                    <p className="text-slate-500 font-medium">Try searching for a different criteria or department.</p>
                </div>
            )}
            
            {/* Database Verification Note */}
            <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 space-y-4">
                    <Trophy className="w-10 h-10 text-yellow-500 mx-auto" />
                    <h3 className="text-2xl sm:text-3xl font-black text-white">400+ More Records Loading</h3>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto">
                        Our Quality Assurance team is currently verifying allocation documents for our 2023 batch. New officer profiles are added to this roster daily.
                    </p>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SuccessStoriesPage
