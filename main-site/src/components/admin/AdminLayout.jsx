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
import NotificationDropdown from '../NotificationDropdown';

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
        <div className="pl-3 flex items-center justify-between shrink-0 mb-4 mt-2">
          <Link to="/" className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
            {isSidebarOpen && (
              <span className="font-bold text-brand uppercase tracking-widest text-sm">
                Al-Haq <span className="opacity-40 font-medium">Admin</span>
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
                {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="pl-4 pt-2 pr-2 pb-2 border-t border-slate-100 shrink-0 mb-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group ${!isSidebarOpen && 'justify-center p-4'}`}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-xs">Sign Out</span>}
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
                placeholder="Audit intelligence search..."
                className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-2.5 text-[11px] w-80 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all text-slate-600 font-bold uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-brand leading-none mb-1 uppercase tracking-widest">Master Admin</div>
                <div className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.2em] leading-none">Security Registry</div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-50 p-0.5 border border-slate-200 shadow-sm overflow-hidden group hover:border-brand transition-all cursor-pointer">
                <img src={`https://ui-avatars.com/api/?name=Admin&background=f1f5f9&color=07102e&bold=true`} alt="Avatar" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
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
