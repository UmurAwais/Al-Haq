import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, CheckCircle2 } from 'lucide-react'
import SuccessCard from './SuccessCard'

const SuccessStories = () => {
  const navigate = useNavigate();
  const stories = [
    // Featured PHP ASI Batch
    {
      name: "Adnan Khan",
      exam: "SI Police",
      achievement: "Allocated as Sub Inspector",
      year: "2026",
      gender: "male",
      image: "/stories/adnan-khan.webp"
    },
    {
      name: "Hafiz Muhammad Umair",
      exam: "SI",
      achievement: "Allocated as Sub Inspector",
      year: "2026",
      gender: "male",
      image: "/stories/umair.webp"
    },
    {
      name: "Kishwar Zubair",
      exam: "SI",
      achievement: "Allocated as Sub Inspector",
      year: "2026",
      gender: "female",
      image: "/stories/kishwar.webp"
    },
    {
      name: "Aqsa Shehzadi",
      exam: "SI",
      achievement: "Allocated as Sub Inspector",
      year: "2026",
      gender: "female",
      image: "/stories/aqsa.webp"
    },
    {
      name: "Kamran Saleem",
      exam: "Excise Inspector",
      achievement: "Posted as BPS-16",
      year: "2023",
      gender: "male",
      image: "/stories/kamran.webp"
    },
    {
      name: "Parsa Shabbir",
      exam: "Excise Inspector",
      achievement: "Posted as BPS-16",
      year: "2023",
      gender: "female",
      image: "/stories/parsa.webp"
    },
    {
      name: "Faizan Zafar",
      exam: "AD Agriculture",
      achievement: "Posted as BPS-17",
      year: "2023",
      gender: "male",
      image: "/stories/faizan.webp"
    },
    {
      name: "Sarmad Bilal",
      exam: "AD Fisheries",
      achievement: "Posted as BPS-17",
      year: "2024",
      gender: "male",
      image: "/stories/sarmad.webp"
    },
    {
      name: "Irfan Farooq",
      exam: "ASF",
      achievement: "Posted in Armed Forces",
      year: "2023",
      gender: "male",
      image: "/stories/irfan.webp"
    },
    {
      name: "Qazi Husnain",
      exam: "AD Rescue 1122",
      achievement: "Posted as BPS-17",
      year: "2023",
      gender: "male",
      image: "/stories/husnain.webp"
    },
    // Featured PHP ASI Batch
    {
      name: "Abdul Basit Khan",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    {
      name: "Fahad Chaema",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    {
      name: "M. Shamoon",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    {
      name: "Zahid Hussain",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    {
      name: "Ali Zaib Lashari",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    {
      name: "Mirfan Yousaf",
      exam: "PHP/ASI",
      achievement: "Allocated as ASI",
      year: "2024",
      gender: "male"
    },
    // Featured Proud Achievers
    {
      name: "Faizan Zafar",
      exam: "Agriculture Officer",
      achievement: "Posted as BPS-17",
      year: "2023",
      gender: "male"
    },
    {
      name: "Maria Aslam",
      exam: "Canal Patwari",
      achievement: "Posted in Revenue",
      year: "2023",
      gender: "female"
    },
    {
      name: "Waseem Akhtar",
      exam: "Punjab Police",
      achievement: "Posted as SI",
      year: "2023",
      gender: "male"
    },
    {
      name: "Muhammad Zafar",
      exam: "Rescue Officer",
      achievement: "Posted in Rescue",
      year: "2023",
      gender: "male"
    },
    {
      name: "Khadija Afzal",
      exam: "Madrassah Teacher",
      achievement: "Posted",
      year: "2023",
      gender: "female"
    },
    {
      name: "Hammad",
      exam: "PHP",
      achievement: "Posted as Police Officer",
      year: "2023",
      gender: "male"
    }
  ]

  // Duplicate stories for a seamless infinite loop with CSS translateX(-50%)
  const duplicatedStories = [...stories, ...stories]

  return (
    <section id="success-stories" className="pb-24 overflow-hidden">
      {/* 1. Header Section - Constrained width */}
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Trophy className="w-3 h-3" />
              Al-Haq Posted Officers
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Our Alumni in <span className="text-brand">Public Service</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl mt-6 font-medium">
              Join the elite league of officers who are now serving the nation after their successful preparation with Al-Haq.
            </p>
          </div>
          
          <div className="flex items-center justify-center lg:justify-end gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-black text-slate-900">500+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Job Allocations</div>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i+45}`} alt="success user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-brand text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                +495
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Infinite Loop Carousel - Full Width */}
      <div className="relative group/marquee overflow-hidden border-y border-slate-50 bg-slate-50/30">
        <div 
          className="flex gap-6 py-12 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
        >
          {duplicatedStories.map((story, i) => (
            <SuccessCard key={i} story={story} variant="marquee" />
          ))}
        </div>
      </div>

      {/* 3. CTA Section - Constrained width */}
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex justify-center">
           <button 
             className="px-8 py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-accent/90 hover:text-white shadow-xl hover:shadow-brand/20 transition-all active:scale-95 flex items-center gap-3 cursor-pointer"
             onClick={() => navigate('/success-stories')}
           >
              View All 500+ Posted Officers
              <CheckCircle2 className="w-4 h-4" />
           </button>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories
