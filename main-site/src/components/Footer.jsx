import logo from '../assets/logo.png'
import { Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle, LayoutDashboard } from 'lucide-react'

const Footer = () => {
  const footerLinks = [
    {
      title: "Al-Haq Hub",
      links: [
        { name: "About Us", href: "#about" },
        { name: "What we offer", href: "#features" },
        { name: "How it works", href: "#how-it-works" },
        { name: "Careers", href: "#careers" }
      ]
    },
    {
      title: "Learning",
      links: [
        { name: "PPSC One-Paper MCQs", href: "#courses" },
        { name: "FPSC General Ability", href: "#courses" },
        { name: "CSS Special Prep", href: "#courses" },
        { name: "GK & Pakistan Affairs", href: "#courses" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#contact" },
        { name: "Help Center", href: "#faq" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Privacy Policy", href: "#privacy" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Learners", href: "#testimonials" },
        { name: "Partners", href: "#partners" },
        { name: "Instructors", href: "#instructors" },
        { name: "Success Stories", href: "#testimonials" }
      ]
    }
  ]

  return (
    <footer className="bg-slate-50 pt-20 pb-12 border-t border-slate-200">
      <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-[18px] font-black text-slate-900 mb-6 tracking-tight">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[14px] font-medium text-slate-600 hover:text-brand transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lower Footer: Apps, Language & Social */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-12 border-t border-slate-200">
          {/* Logo & Actions */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <a href="#home" className="shrink-0">
              <img src={logo} alt="Al-Haq Logo" className="h-16 w-auto object-contain" />
            </a>
            
            <div className="flex gap-3">
               <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-2.5 bg-[#25D366] text-white rounded-xl cursor-pointer hover:bg-[#128C7E] transition-all hover:-translate-y-0.5 shadow-lg shadow-green-500/10">
                 <MessageCircle className="w-5 h-5 fill-white/20" />
                 <div className="leading-none text-left">
                    <div className="text-[8px] uppercase font-black opacity-80 tracking-widest">Join our</div>
                    <div className="text-[13px] font-black">WhatsApp</div>
                 </div>
               </a>
               <a href="#portal" className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-black/10">
                 <LayoutDashboard className="w-5 h-5 opacity-60" />
                 <div className="leading-none text-left">
                    <div className="text-[8px] uppercase font-black opacity-60 tracking-widest">Access</div>
                    <div className="text-[13px] font-black">Student Portal</div>
                 </div>
               </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white transition-all">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 text-center text-[12px] text-slate-400 font-medium">
          <p>© 2026 Al-Haq Learning Institute. Pakistan's Leading Digital Education Platform.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
