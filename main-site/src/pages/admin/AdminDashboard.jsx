import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  BookOpen,
  ShoppingCart,
  ArrowUpRight,
  TrendingUp,
  Lightbulb,
  X,
  Eye,
  Trash2,
  ChevronDown,
  Plus,
  FolderOpen,
  UserCog,
  LayoutGrid,
} from 'lucide-react';
import { apiFetch } from '../../config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    students: 0,
    courses: 0,
    ordersThisMonth: 0,
    ordersGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [showTip, setShowTip] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('Last 7 days');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { 'x-admin-token': token };

      // Fetch all data in parallel
      const [ordersRes, usersRes, onsiteRes, onlineRes] = await Promise.all([
        apiFetch('/api/orders', { headers }).then(r => r.json()).catch(() => ({ orders: [] })),
        apiFetch('/api/admin/users', { headers }).then(r => r.json()).catch(() => ({ users: [] })),
        apiFetch('/api/courses/onsite', { headers }).then(r => r.json()).catch(() => ({ ok: false, courses: [] })),
        apiFetch('/api/courses/online', { headers }).then(r => r.json()).catch(() => ({ ok: false, courses: [] })),
      ]);

      // Calculate stats
      const orders = ordersRes.orders || ordersRes || [];
      const users = usersRes.users || [];
      const onsiteCourses = onsiteRes.courses || [];
      const onlineCourses = onlineRes.courses || [];
      const totalCourses = onsiteCourses.length + onlineCourses.length;

      // Revenue calculation
      const totalRevenue = Array.isArray(orders)
        ? orders.reduce((sum, o) => {
            const price = parseFloat(String(o.price || o.amount || 0).replace(/[^0-9.]/g, ''));
            return sum + (isNaN(price) ? 0 : price);
          }, 0)
        : 0;

      // Orders this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const ordersThisMonth = Array.isArray(orders)
        ? orders.filter(o => new Date(o.createdAt || o.date) >= startOfMonth).length
        : 0;

      // Previous month orders for growth
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const ordersLastMonth = Array.isArray(orders)
        ? orders.filter(o => {
            const d = new Date(o.createdAt || o.date);
            return d >= startOfLastMonth && d < startOfMonth;
          }).length
        : 0;

      const growth = ordersLastMonth > 0
        ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
        : ordersThisMonth > 0 ? 100 : 0;

      // Generate chart data (last 7 days revenue)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayRevenue = Array.isArray(orders)
          ? orders
              .filter(o => {
                const od = new Date(o.createdAt || o.date);
                return od.toDateString() === d.toDateString();
              })
              .reduce((sum, o) => {
                const price = parseFloat(String(o.price || o.amount || 0).replace(/[^0-9.]/g, ''));
                return sum + (isNaN(price) ? 0 : price);
              }, 0)
          : 0;
        last7Days.push({ label: dayStr, value: dayRevenue });
      }
      setChartData(last7Days);

      setStats({
        revenue: totalRevenue,
        students: users.length,
        courses: totalCourses,
        ordersThisMonth,
        ordersGrowth: parseFloat(growth),
      });

      // Recent orders (last 10)
      const sorted = Array.isArray(orders)
        ? [...orders].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 8)
        : [];
      setRecentOrders(sorted);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  // Simple SVG line chart
  const maxChartVal = Math.max(...chartData.map(d => d.value), 1);
  const chartPoints = chartData.map((d, i) => {
    const x = (i / Math.max(chartData.length - 1, 1)) * 100;
    const y = 100 - (d.value / maxChartVal) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const statCards = [
    {
      label: 'TOTAL REVENUE',
      value: formatCurrency(stats.revenue),
      sub: 'Lifetime earnings',
      icon: DollarSign,
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      barColor: 'bg-emerald-500',
    },
    {
      label: 'TOTAL STUDENTS',
      value: stats.students,
      sub: 'Unique enrollments',
      icon: Users,
      iconBg: 'bg-indigo-600',
      iconColor: 'text-white',
      barColor: 'bg-indigo-500',
    },
    {
      label: 'ACTIVE COURSES',
      value: stats.courses,
      sub: 'Published courses',
      icon: BookOpen,
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      barColor: 'bg-amber-400',
    },
    {
      label: 'ORDERS THIS MONTH',
      value: stats.ordersThisMonth,
      sub: 'From all sources',
      icon: ShoppingCart,
      iconBg: 'bg-slate-700',
      iconColor: 'text-white',
      barColor: 'bg-slate-400',
      badge: stats.ordersGrowth > 0 ? `↑ ${stats.ordersGrowth}%` : stats.ordersGrowth < 0 ? `↓ ${Math.abs(stats.ordersGrowth)}%` : null,
      badgeColor: stats.ordersGrowth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dashboard Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <LayoutGrid size={24} className="text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">Welcome back, Administrator. Monitoring Al-Haq's presence today.</p>
          </div>
        </div>
        
        <div className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">System Status: Active</span>
        </div>
      </div>

      {/* Stats Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
         {statCards.map((card, i) => (
           <div
             key={i}
             className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
           >
             {/* Badge (for orders card) */}
             {card.badge && (
               <span className={`absolute top-6 right-6 px-2 py-1 text-[10px] font-bold rounded-lg border border-transparent ${card.badgeColor}`}>
                 {card.badge}
               </span>
             )}
 
             {/* Icon */}
             <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 shadow-sm transform group-hover:rotate-6 transition-transform duration-500`}>
               <card.icon size={22} className={card.iconColor} />
             </div>
 
             {/* Label */}
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{card.label}</p>
 
             {/* Value */}
             <div className="flex items-baseline gap-1 mb-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{loading ? '...' : card.value}</h3>
             </div>
 
             {/* Subtitle */}
             <p className="text-[11px] text-slate-400 font-medium">{card.sub}</p>
 
             {/* Bottom colored bar accent */}
             <div className={`absolute bottom-0 left-0 h-1.5 ${card.barColor} w-full opacity-10 group-hover:opacity-100 transition-opacity duration-500`}></div>
           </div>
         ))}
       </div>

      {/* Quality Content Tip Banner */}
      {showTip && (
        <div className="bg-brand/5 border border-brand/10 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-start md:items-center gap-5 relative z-10">
            <div className="p-3 bg-brand/10 rounded-2xl shrink-0 mt-1 md:mt-0 text-brand">
              <Lightbulb size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Maximize Student Engagement</h3>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed max-w-xl">
                Courses structured with 10+ modules and interactive quizzes receive 60% more positive conversion rates. Focus on depth and clarity to boost your revenue.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 relative z-10">
            <Link to="/admin/courses" className="px-6 py-2.5 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand/10 whitespace-nowrap">
              Design My Course
            </Link>
            <button onClick={() => setShowTip(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Revenue Analytics Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Analytics</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium italic">Monitoring financial performance vs last period</p>
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {['Last 7 days', 'Last 30 days', 'Yearly'].map((p) => (
              <button 
                key={p} 
                onClick={() => setChartPeriod(p)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${chartPeriod === p ? 'bg-white text-brand shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-64">
          {chartData.length > 0 && (
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.3" />
              ))}
              {/* Area fill */}
              <polygon
                points={`0,100 ${chartPoints} 100,100`}
                fill="url(#chartGradient)"
                opacity="0.3"
              />
              {/* Line */}
              <polyline
                points={chartPoints}
                fill="none"
                stroke="#07102E"
                strokeWidth="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {chartData.map((d, i) => {
                const x = (i / Math.max(chartData.length - 1, 1)) * 100;
                const y = 100 - (d.value / maxChartVal) * 80 - 10;
                return (
                  <circle key={i} cx={x} cy={y} r="1" fill="#07102E" />
                );
              })}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#07102E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#07102E" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Y-axis labels */}
          <div className="absolute -left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 font-medium py-1">
            {[maxChartVal, maxChartVal * 0.75, maxChartVal * 0.5, maxChartVal * 0.25, 0].map((val, i) => (
              <span key={i}>Rs.{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}</span>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-slate-400 font-medium px-1 translate-y-5">
            {chartData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center border border-brand/10">
                  <ShoppingCart size={18} className="text-brand" />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Recent Activity</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest Student Enrollments</p>
               </div>
            </div>
            <Link to="/admin/orders" className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-brand uppercase tracking-widest transition-all border border-slate-100">
              View Audit Log
            </Link>
          </div>
 
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand/10 border-t-brand rounded-full animate-spin"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <ShoppingCart size={32} className="opacity-30" />
              </div>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">No Market Orders Yet</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Enrollments will appear here once students purchase courses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Details</th>
                    <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Point</th>
                    <th className="px-2 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proof</th>
                    <th className="px-4 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-4 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order, i) => (
                    <tr key={order._id || i} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border border-slate-200">
                              {(order.name || 'U').charAt(0).toUpperCase()}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-brand transition-colors">{order.name || 'Unknown User'}</p>
                             <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 max-w-35">{order.courseName || order.courseId || '-'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-sm font-bold text-slate-900 tracking-tight">
                          Rs. {parseFloat(String(order.price || order.amount || 0).replace(/[^0-9.]/g, '')).toLocaleString('en-PK')}
                        </span>
                      </td>
                      <td className="px-2 py-5 text-center">
                        {order.screenshotUrl || order.screenshot ? (
                          <a
                            href={order.screenshotUrl || order.screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100/50"
                          >
                            <Eye size={12} strokeWidth={2.5} /> View
                          </a>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No File</span>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs text-slate-500 font-medium">{formatDate(order.createdAt || order.date)}</span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Workflow</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Operational Shortcuts</p>
          </div>
          <div className="space-y-4">
            <Link
              to="/admin/courses"
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-brand/20 hover:bg-brand/5 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center group-hover:bg-brand transition-all duration-500">
                  <Plus size={20} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <div>
                   <span className="text-sm font-bold text-slate-800 group-hover:text-brand transition-colors block">Launch Course</span>
                   <span className="text-[10px] text-slate-400 font-medium">Create new educational material</span>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-300 group-hover:text-brand transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
 
            <Link
              to="/admin/drive"
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-amber-500/20 hover:bg-amber-50/50 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-500">
                  <FolderOpen size={20} className="text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors block">Cloud Storage</span>
                   <span className="text-[10px] text-slate-400 font-medium">Manage uploaded static assets</span>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-300 group-hover:text-amber-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
 
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-500/20 hover:bg-indigo-50/50 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500">
                  <UserCog size={20} className="text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block">User Access</span>
                  <span className="text-[10px] text-slate-400 font-medium">Moderate student permissions</span>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-slate-400">
        © {new Date().getFullYear()} Al-Haq Learning Hub. All rights reserved.
      </div>
    </div>
  );
};

export default AdminDashboard;
