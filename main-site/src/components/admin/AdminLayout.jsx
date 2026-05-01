import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  HardDrive, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Award, 
  BadgeCheck, 
  Activity, 
  ShieldCheck, 
  UserCircle, 
  Image, 
  Ticket, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import NotificationDropdown from '../NotificationDropdown';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // PWA Install Logic
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  // Handle window resize to auto-close/open sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
    // { name: 'Live Classes', icon: Video, path: '/admin/live' },
    { name: 'Drive', icon: HardDrive, path: '/admin/drive' },
    { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Contacts', icon: MessageSquare, path: '/admin/contacts' },
    { name: 'Certificates', icon: Award, path: '/admin/certificates' },
    { name: 'Badges', icon: BadgeCheck, path: '/admin/badges' },
    // { name: 'Gallery', icon: Image, path: '/admin/gallery' },
    { name: 'Coupons', icon: Ticket, path: '/admin/coupons' },
    { name: 'Activity Log', icon: Activity, path: '/admin/activity' },
    { name: 'Roles', icon: ShieldCheck, path: '/admin/roles' },
    { name: 'Profile', icon: UserCircle, path: '/admin/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden admin-dashboard relative">
      {/* Sidebar Backdrop — mobile only */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky inset-y-0 left-0 z-[70] bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-2xl md:shadow-sm
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
          md:top-0 md:h-screen
        `}
      >
        <div className="pl-3 flex items-center justify-between shrink-0 mb-0 mt-2">
          <Link to="/" className={`flex items-center gap-3 ${(!isSidebarOpen) && 'md:justify-center md:w-full'}`}>
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            {(isSidebarOpen || window.innerWidth <= 768) && (
              <span className="font-bold text-brand uppercase tracking-widest text-sm">
                Al-Haq <span className="opacity-40 font-medium">Admin</span>
              </span>
            )}
          </Link>
          {/* Close button - mobile only */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 mr-4 text-slate-400 hover:text-brand md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => window.innerWidth <= 768 && setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-brand text-white shadow-xl shadow-brand/20 font-bold' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-brand'
                } ${(!isSidebarOpen) && 'md:justify-center md:p-4'}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand transition-colors'}`} />
                {(isSidebarOpen || window.innerWidth <= 768) && <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="pl-4 pt-2 pr-2 pb-2 border-t border-slate-100 shrink-0 mb-0">
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-brand bg-brand/5 hover:bg-brand hover:text-white transition-all group mb-2 ${(!isSidebarOpen) && 'md:justify-center md:p-4'}`}
            >
              <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {(isSidebarOpen || window.innerWidth <= 768) && <span className="font-bold uppercase tracking-widest text-[10px]">Install App</span>}
            </button>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group ${(!isSidebarOpen) && 'md:justify-center md:p-4'}`}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {(isSidebarOpen || window.innerWidth <= 768) && <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* Header - Made Sticky */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-10 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Audit intelligence search..."
                className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-2.5 text-[11px] w-80 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all text-slate-600 font-bold uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <NotificationDropdown isAdmin={true} />
            <div className="h-8 w-px bg-slate-200 hidden xs:block"></div>
            <div className="flex items-center gap-2 md:gap-4 md:pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-brand leading-none mb-1 uppercase tracking-widest">Master Admin</div>
                <div className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.2em] leading-none">Security Registry</div>
              </div>
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl md:rounded-2xl bg-slate-50 p-0.5 border border-slate-200 shadow-sm overflow-hidden group hover:border-brand transition-all cursor-pointer">
                <img src={`https://ui-avatars.com/api/?name=Admin&background=f1f5f9&color=07102e&bold=true`} alt="Avatar" className="w-full h-full object-cover rounded-lg md:rounded-xl group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar bg-slate-50">
            <div className="w-full max-w-7xl mx-auto pb-10">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
