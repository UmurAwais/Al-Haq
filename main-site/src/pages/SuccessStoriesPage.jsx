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
    // PHP ASI Batch - Record Breaking Success (30 Students)
    {
      name: "Abdul Basit Khan",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Atif Mustaq",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Fahad Chaema",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Abdul Waheed",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Shahbaz Raja",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Abdul Sattar",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Liaqat Ali",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M. Qasim",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M. Shamoon",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M. Yasir",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Ahmad Saleem",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Zulfiqar Ali",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Nouman Nasir",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Abdul Khaliq",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Zahid Hussain",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Muzammil Amen",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Waseem Ahmad",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Akhtar Abbas",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Habib ur Rehman",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M Awais Wajid",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Ijaz Sanghero",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M. Akram Khan",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "M. Asif",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Ali Zaib Lashari",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Rana Fayyaz",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Shafqat Abbas",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Asif Khan",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Rashid Hussain",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Muzzam Ali",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Mirfan Yousaf",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Police"
    },

    // Proud Achievers - Various Positions
    {
      name: "Faizan Zafar",
      exam: "BPS-17",
      achievement: "Posted as Agriculture Officer",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "Agriculture Department"
    },
    {
      name: "Kamran Saleem",
      exam: "BPS-16",
      achievement: "Posted as Excise Inspector",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Excise Department"
    },
    {
      name: "Parsa Shabbir",
      exam: "BPS-16",
      achievement: "Posted as Excise Inspector",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "Excise Department"
    },
    {
      name: "Sidra Kamal",
      exam: "BPS-16",
      achievement: "Posted as Assistant",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "Administrative Department"
    },
    {
      name: "Areesha Mazhar",
      exam: "SI",
      achievement: "Posted in Ministry of Defence",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507876466836-bc7706f854ec?w=400&h=400&fit=crop",
      dept: "Ministry of Defence"
    },
    {
      name: "Haliz Haseeb",
      exam: "SI",
      achievement: "Posted in Punjab Police",
      year: "2023",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Punjab Police"
    },
    {
      name: "Khadija Afzal",
      exam: "Various",
      achievement: "Allocated in Madrassah",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "Education"
    },
    {
      name: "M. Zubair Amjad",
      exam: "Food Grain",
      achievement: "Posted as Supervisor",
      year: "2023",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Food Department"
    },
    {
      name: "Nazir Ahmad",
      exam: "Food Grain",
      achievement: "Posted as Supervisor",
      year: "2023",
      image: "https://images.unsplash.com/photo-1519085360753-af0119e43470?w=400&h=400&fit=crop",
      dept: "Food Department"
    },
    {
      name: "Zeya Imtiaz",
      exam: "Food Grain",
      achievement: "Posted as Supervisor",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "Food Department"
    },
    {
      name: "M Irfan",
      exam: "ASF",
      achievement: "Posted in Armed Forces",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Armed Forces"
    },
    {
      name: "Ali Raza",
      exam: "ASF",
      achievement: "Posted in Armed Forces",
      year: "2023",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Armed Forces"
    },
    {
      name: "Muhammad Zafar",
      exam: "Rescue",
      achievement: "Posted as Rescue Officer",
      year: "2023",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Rescue Department"
    },
    {
      name: "Maria Aslam",
      exam: "Canal",
      achievement: "Posted as Patwari",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "Revenue Department"
    },
    {
      name: "Waseem Akhtar",
      exam: "PPP",
      achievement: "Posted in Punjab Police",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Punjab Police"
    },
    {
      name: "Yasir Iqbal",
      exam: "PPP",
      achievement: "Posted in Punjab Police",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "Punjab Police"
    },
    {
      name: "Muqadas Aslam",
      exam: "SPU",
      achievement: "Posted in Special Police Unit",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507876466836-bc7706f854ec?w=400&h=400&fit=crop",
      dept: "Special Police Unit"
    },
    {
      name: "Hammad",
      exam: "PHP",
      achievement: "Posted as Police Officer",
      year: "2023",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Police"
    },
    {
      name: "Adnaa Waheed",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Shahboz Mahar",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Mehwish Rashid",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1407746352059-32b5fabb75d2?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Nina Shabir",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Zunaira Ashraf",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Taha Rax",
      exam: "CTD",
      achievement: "Posted in Counter Terrorism",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "Counter Terrorism Department"
    },
    {
      name: "Sidra Ahmad Yar",
      exam: "GTD",
      achievement: "Posted in General Services",
      year: "2023",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      dept: "General Services"
    },
    {
      name: "Roman Bashir",
      exam: "GTD",
      achievement: "Posted in General Services",
      year: "2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      dept: "General Services"
    },
    {
      name: "Maryam Saeed",
      exam: "GTD",
      achievement: "Posted in General Services",
      year: "2023",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      dept: "General Services"
    },
    {
      name: "Fida Hussain",
      exam: "Various",
      achievement: "Successfully Allocated",
      year: "2023",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      dept: "Government Services"
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
                        Browse success records from our PHP ASI batch (record-breaking 100% results) and our Proud Achievers program spanning multiple government departments and services.
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
                    { label: 'PHP ASI Batch', value: '30', icon: Award, color: 'text-brand' },
                    { label: 'Proud Achievers', value: '29', icon: ShieldCheck, color: 'text-brand' },
                    { label: 'Success Ratio', value: '85%+', icon: Star, color: 'text-brand' },
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
                    <h3 className="text-2xl sm:text-3xl font-black text-white">59+ Success Stories Documented</h3>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto">
                        Our PHP ASI batch achieved a record-breaking 100% allocation with 30 officers. Join our Proud Achievers program to explore success stories across multiple government departments and services.
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
