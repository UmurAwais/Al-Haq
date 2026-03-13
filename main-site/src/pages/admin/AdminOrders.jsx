import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  MoreVertical,
  Loader2,
  Calendar,
  DollarSign,
  User,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { apiFetch, getApiUrl } from '../../config';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch('/api/orders', {
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      
      // Handle the data structure (it might be { orders: [] } or just [])
      const ordersData = data.orders || (Array.isArray(data) ? data : []);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'verified':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'verified':
        return <CheckCircle size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'cancelled':
      case 'failed':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || (order.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const [processing, setProcessing] = useState(false);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-token': token 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This will revoke the student\'s access.')) return;
    try {
      setProcessing(true);
      const token = localStorage.getItem('adminToken');
      const response = await apiFetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      const data = await response.json();
      if (data.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        setIsDetailsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Failed to delete order');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    const num = parseFloat(String(price || 0).replace(/[^0-9.]/g, ''));
    return `Rs. ${num.toLocaleString('en-PK')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats calculation - Only count confirmed revenue
  const totalRevenue = orders.reduce((sum, o) => {
    const status = (o.status || 'pending').toLowerCase();
    if (status !== 'completed' && status !== 'verified') return sum;
    const price = parseFloat(String(o.price || o.amount || 0).replace(/[^0-9.]/g, ''));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  
  const pendingOrders = orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length;
  const completedOrders = orders.filter(o => ['completed', 'verified'].includes((o.status || '').toLowerCase())).length;

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/5 rounded-2xl border border-brand/10 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Orders</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider opacity-60">Manage student enrollments and payments</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Earnings</span>
                <span className="text-xl font-bold text-brand tracking-tight">{formatPrice(totalRevenue)}</span>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-brand/20 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95">
              <Download size={16} /> Export CSV
            </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-brand/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{orders.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-amber-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pending</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{pendingOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Completed</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{completedOrders}</h3>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="border-b border-slate-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 pt-6 pb-0">
             <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name, email or ID..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-xs font-bold border border-slate-100 rounded-xl outline-none focus:border-brand/30 focus:bg-slate-50/50 transition-all text-slate-600 placeholder:text-slate-300"
                />
             </div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
               Showing {filteredOrders.length} of {orders.length} orders
             </div>
          </div>

          <div className="flex items-center px-6 mt-4 gap-8">
            {['All', 'Pending', 'Completed', 'Cancelled'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setStatusFilter(tab.toLowerCase())}
                className={`pb-4 text-[10px] font-bold uppercase tracking-widest relative transition-all ${statusFilter === tab.toLowerCase() ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {statusFilter === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full shadow-[0_-1px_4px_rgba(7,16,46,0.2)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-brand animate-spin mb-4 opacity-20" />
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Initialising Order Ledger...</p>
             </div>
          ) : filteredOrders.length === 0 ? (
             <div className="py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                    <ShoppingBag size={40} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight mb-2">No Records Found</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or try a different search term</p>
             </div>
          ) : (
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Details</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Course</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proof</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredOrders.map((order) => (
                      <tr key={order._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => openDetails(order)}>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 p-0.5 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all">
                                  <User size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-800 tracking-tight leading-tight mb-0.5 group-hover:text-brand transition-colors uppercase">
                                    {order.firstName ? `${order.firstName} ${order.lastName || ''}`.trim() : (order.name || 'Unknown Student')}
                                  </p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{order.email || '-'}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <p className="text-xs font-bold text-slate-600 leading-snug max-w-50 line-clamp-2 uppercase tracking-tight">
                               {order.courseName || order.courseId || 'Enrolled Course'}
                            </p>
                         </td>
                         <td className="px-6 py-6 font-mono">
                            <span className="text-sm font-black text-slate-900 tracking-tighter">
                               {formatPrice(order.price || order.amount)}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                               {getStatusIcon(order.status)}
                               {order.status || 'PENDING'}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-center">
                           {order.paymentScreenshot || order.screenshotUrl || order.screenshot ? (
                             <div className="flex justify-center">
                               <div className="w-12 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative group/ss shadow-sm">
                                  <img src={order.paymentScreenshot || order.screenshotUrl || order.screenshot} className="w-full h-full object-cover grayscale group-hover/ss:grayscale-0 transition-all" alt="Proof" />
                                  <div className="absolute inset-0 bg-brand/40 opacity-0 group-hover/ss:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <Eye size={12} />
                                  </div>
                               </div>
                             </div>
                           ) : (
                             <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">—</span>
                           )}
                         </td>
                         <td className="px-8 py-6 text-right">
                            <p className="text-xs font-black text-slate-700 tracking-tighter mb-0.5">{formatDate(order.createdAt || order.date).split(',')[0]}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(order.createdAt || order.date).split(',')[1]}</p>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        {!loading && filteredOrders.length > 0 && (
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <button disabled className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed transition-all">
                        <Calendar size={18} className="rotate-90" />
                    </button>
                    <div className="px-5 py-2.5 rounded-xl bg-white border border-brand/20 text-brand font-black text-xs tracking-widest shadow-sm">PAGE 1 OF 1</div>
                    <button disabled className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-300 cursor-not-allowed transition-all">
                        <Calendar size={18} className="-rotate-90" />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setIsDetailsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order details</h2>
                <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">Reference ID: #{selectedOrder._id?.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all active:scale-95 border border-slate-100">
                <XCircle size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: Student & Details */}
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} className="text-brand" /> Student Information
                    </h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-slate-200/50 px-6">                             <div className="flex justify-between items-center py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Full Name</span>
                                <span className="text-sm font-bold text-slate-800">
                                  {selectedOrder.firstName ? `${selectedOrder.firstName} ${selectedOrder.lastName || ''}`.trim() : (selectedOrder.name || 'N/A')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                                <span className="text-sm font-bold text-slate-800">{selectedOrder.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                                <span className="text-sm font-bold text-slate-800">{selectedOrder.phone || selectedOrder.whatsapp || 'N/A'}</span>
                            </div>

                        </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={14} className="text-brand" /> Transaction details
                    </h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-slate-200/50 px-6">
                            <div className="flex justify-between items-start py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Course</span>
                                <span className="text-sm font-bold text-slate-800 text-right max-w-50">{selectedOrder.courseName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                                   {selectedOrder.status || 'PENDING'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total cost</span>
                                <span className="text-lg font-bold text-brand tracking-tight">{formatPrice(selectedOrder.price || selectedOrder.amount)}</span>
                            </div>
                        </div>
                    </div>
                  </section>
                  
                  {selectedOrder.notes && (
                      <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Order Notes</h3>
                        <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 text-sm font-bold text-amber-900/70 italic">
                            "{selectedOrder.notes}"
                        </div>
                      </section>
                  )}
                </div>

                {/* Right Side: Payment Proof */}
                <div className="space-y-6">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <DollarSign size={14} className="text-brand" /> Payment verification
                   </h3>
                   <div className="relative group rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden aspect-3/4 bg-slate-50">
                        {selectedOrder.paymentScreenshot || selectedOrder.screenshotUrl || selectedOrder.screenshot ? (
                          <>
                          <img 
                            src={selectedOrder.paymentScreenshot || selectedOrder.screenshotUrl || selectedOrder.screenshot} 
                            alt="Payment Proof" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <a 
                            href={selectedOrder.paymentScreenshot || selectedOrder.screenshotUrl || selectedOrder.screenshot} 
                            target="_blank" 
                            rel="noreferrer"
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-xl font-bold text-xs text-slate-800 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-white"
                          >
                            <ExternalLink size={14} /> Open full view
                          </a>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                            <XCircle size={48} className="mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Screenshot Provided</p>
                          </div>
                        )}
                   </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
               <div className="flex items-center gap-3 w-full sm:w-auto">
                   <button 
                     disabled={processing}
                     onClick={() => handleDeleteOrder(selectedOrder._id)}
                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                   >
                       {processing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
                   </button>
               </div>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                   <button 
                     disabled={processing}
                     onClick={() => handleUpdateStatus(selectedOrder._id, 'Rejected')}
                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                   >
                       Reject
                   </button>
                   <button 
                     disabled={processing}
                     onClick={() => handleUpdateStatus(selectedOrder._id, 'Verified')}
                     className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-brand text-white rounded-xl font-bold text-xs shadow-lg shadow-brand/10 transition-all active:scale-95 hover:scale-[1.02] disabled:opacity-50"
                   >
                       {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Verify payment
                   </button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
