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
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand/10 rounded-lg">
          <LayoutGrid size={20} className="text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Welcome back! Here's what's happening with your courses.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Badge (for orders card) */}
            {card.badge && (
              <span className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-bold rounded-md ${card.badgeColor}`}>
                {card.badge}
              </span>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
              <card.icon size={22} className={card.iconColor} />
            </div>

            {/* Label */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>

            {/* Value */}
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">{loading ? '...' : card.value}</h3>

            {/* Subtitle */}
            <p className="text-xs text-slate-400">{card.sub}</p>

            {/* Bottom colored bar */}
            <div className={`absolute bottom-0 left-0 h-1 ${card.barColor} w-full opacity-20 group-hover:opacity-50 transition-opacity`}></div>
          </div>
        ))}
      </div>

      {/* Quality Content Tip Banner */}
      {showTip && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 flex items-start md:items-center justify-between gap-4 relative">
          <div className="flex items-start md:items-center gap-4">
            <div className="p-2.5 bg-brand/10 rounded-xl shrink-0 mt-0.5 md:mt-0">
              <Lightbulb size={20} className="text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Quality Content</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Courses with 10+ lectures and 2+ hours of content receive 60% more positive reviews. Quality over quantity!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/admin/courses" className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shadow-sm">
              Add Content
            </Link>
            <button onClick={() => setShowTip(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Revenue Analytics Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Revenue Analytics</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track your earnings over time</p>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-brand/30 transition-colors">
              {chartPeriod}
              <ChevronDown size={14} />
            </button>
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-brand hover:underline underline-offset-2">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-3 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Student</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Course</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Amount</th>
                    <th className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Payment SS</th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Date</th>
                    <th className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order, i) => (
                    <tr key={order._id || i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{order.name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{order.email || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3.5 max-w-[200px]">
                        <p className="text-xs text-slate-600 font-medium leading-snug truncate">{order.courseName || order.courseId || '-'}</p>
                      </td>
                      <td className="py-3.5">
                        <span className="text-sm font-bold text-slate-800">
                          Rs. {parseFloat(String(order.price || order.amount || 0).replace(/[^0-9.]/g, '')).toLocaleString('en-PK')}
                        </span>
                      </td>
                      <td className="py-3.5 text-center">
                        {order.screenshotUrl || order.screenshot ? (
                          <a
                            href={order.screenshotUrl || order.screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                          >
                            <Eye size={12} /> View
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className="text-xs text-slate-500">{formatDate(order.createdAt || order.date)}</span>
                      </td>
                      <td className="py-3.5 text-center">
                        <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/courses"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand/20 hover:bg-brand/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:shadow-md transition-all">
                  <Plus size={18} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-brand transition-colors">Add New Course</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-brand transition-colors" />
            </Link>

            <Link
              to="/admin/drive"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-500/20 hover:bg-amber-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 group-hover:shadow-md transition-all">
                  <FolderOpen size={18} className="text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">Manage Resources</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-500/20 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-500 group-hover:shadow-md transition-all">
                  <UserCog size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">View Users</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
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
