import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Award,
  Clock,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';
import NotificationDropdown from '../NotificationDropdown';

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'My Learning', icon: BookOpen, path: '/student/courses' },
    { name: 'Certificates', icon: Award, path: '/student/achievements' },
    { name: 'Profile', icon: UserCircle, path: '/student/profile' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 z-50 shadow-sm sticky top-0 h-screen hidden lg:flex lg:flex-col`}
      >
        <div className="pl-3 flex items-center shrink-0 mb-4 mt-2">
          <Link to="/" className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            {isSidebarOpen && (
              <span className="font-bold text-brand uppercase tracking-widest text-sm">
                Al-Haq <span className="opacity-40 font-medium">Hub</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-brand text-white shadow-xl shadow-brand/20 font-bold' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-brand'
                } ${!isSidebarOpen && 'justify-center p-4'}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand transition-colors'}`} />
                {isSidebarOpen && (
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 mb-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group ${!isSidebarOpen && 'justify-center p-4'}`}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all lg:block hidden"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden flex items-center gap-3">
               <img src={logo} alt="Logo" className="h-12 w-12" />
               <span className="text-xs font-black text-brand uppercase tracking-widest">Al-Haq</span>
            </div>
            
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..."
                className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-2.5 text-[11px] w-64 lg:w-80 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all text-slate-600 font-bold uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 lg:gap-4 pl-0 sm:pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-brand leading-none mb-1 uppercase tracking-widest">
                  {user?.displayName || 'Student'}
                </div>
                <div className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.2em] leading-none">Registered Student</div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-50 p-0.5 border border-slate-200 shadow-sm overflow-hidden group hover:border-brand transition-all cursor-pointer">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.displayName || 'S'}&background=f1f5f9&color=07102e&bold=true`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar bg-slate-50 pb-28 lg:pb-10 scroll-smooth">
          <div className="w-full max-w-7xl mx-auto">
             <Outlet />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center z-50 px-4 py-3 pb-6">
           {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                key={item.name} 
                to={item.path} 
                className={`flex flex-col items-center gap-1 flex-1 p-1 transition-all ${isActive ? 'text-brand' : 'text-slate-400'}`}
               >
                  <item.icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{item.name}</span>
               </Link>
             );
           })}
        </nav>
      </main>
    </div>
  );
};

export default StudentLayout;
