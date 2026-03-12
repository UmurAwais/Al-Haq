import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, MessageSquare, AlertCircle, Trash2, ExternalLink, Loader2, User, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../config';

const NotificationDropdown = ({ isAdmin = false }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user?.email || isAdmin) {
            fetchNotifications();
            // Polling for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user, isAdmin]);

    const fetchNotifications = async () => {
        try {
            const url = isAdmin 
                ? `${getApiUrl()}/api/admin/notifications`
                : `${getApiUrl()}/api/notifications/${user?.email}`;
            
            const headers = {};
            if (isAdmin) {
                headers['x-admin-token'] = localStorage.getItem('adminToken');
            }

            const res = await fetch(url, { headers });
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return; // Silently fail for polling or log it
            }
            const data = await res.json();
            if (data.ok) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = async () => {
        try {
            await fetch(`${getApiUrl()}/api/notifications/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true, email: isAdmin ? 'admin' : user?.email })
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`${getApiUrl()}/api/notifications/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const clearAll = async () => {
        try {
            await fetch(`${getApiUrl()}/api/notifications/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: isAdmin ? 'admin' : user?.email })
            });
            setNotifications([]);
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (iconName) => {
        const icons = { CheckCircle2, Clock, MessageSquare, AlertCircle, Trash2, Bell, User, Activity, RefreshCw };
        const IconComp = icons[iconName] || Bell;
        return <IconComp size={18} />;
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-2xl transition-all group border ${isOpen ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20 cursor-pointer' : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-100 cursor-pointer'}`}
            >
                <Bell size={20} className={`${!isOpen && 'group-hover:rotate-12'} transition-transform`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in zoom-in-95 fade-in duration-200 origin-top-right">
                    <div className="flex items-center justify-between p-4 px-5 border-b border-slate-50 mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">Signal Hub</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} Active Pulse</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] font-bold text-brand hover:underline uppercase tracking-widest cursor-pointer">Mark All Read</button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest cursor-pointer">Clear</button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto px-2 pb-2 custom-scrollbar">
                        {loading ? (
                            <div className="py-12 flex items-center justify-center">
                                <Loader2 className="animate-spin text-brand/20" size={32} />
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="space-y-1">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        onClick={() => markAsRead(notification.id)}
                                        className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer group hover:bg-slate-50 relative ${!notification.read ? 'bg-brand/5' : ''}`}
                                    >
                                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                                            notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            notification.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            notification.type === 'message' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                            {getIcon(notification.icon)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`text-xs font-bold leading-tight line-clamp-1 group-hover:text-brand transition-colors ${!notification.read ? 'text-slate-900' : 'text-slate-500'}`}>{notification.title}</h4>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0 ml-4">{getTimeAgo(notification.createdAt)}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Zero Frequency</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Your vault is clean for now.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50/50 rounded-2xl border-t border-slate-50 flex items-center justify-center">
                        <button onClick={fetchNotifications} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-brand uppercase tracking-widest transition-all">
                             Refresh Signals <Clock size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;

