import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
      {/* Sidebar - Made Sticky */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50 shadow-sm sticky top-0 h-screen`}
      >
        <div className="pl-3 flex items-center justify-between shrink-0">
          <Link to="/" className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            {isSidebarOpen && (
              <span className="font-black text-brand uppercase tracking-widest text-sm">
                Admin <span className="opacity-60">Hub</span>
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
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-brand text-white shadow-lg shadow-brand/20 font-bold' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-brand'
                } ${!isSidebarOpen && 'justify-center p-4'}`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand transition-colors'}`} />
                {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group ${!isSidebarOpen && 'justify-center p-4'}`}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-black uppercase tracking-widest text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* Header - Made Sticky */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..."
                className="bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-6 py-2.5 text-xs w-80 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all text-slate-600 font-bold uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400 group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-brand leading-none mb-1 uppercase tracking-tight">Super Admin</div>
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Al-Haq Learning</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 p-0.5 border border-slate-200 shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=07102e&color=fff" alt="Avatar" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50">
            <div className="w-full max-w-7xl mx-auto pb-10">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
