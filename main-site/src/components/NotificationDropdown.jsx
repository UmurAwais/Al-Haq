import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, MessageSquare, AlertCircle, X, ExternalLink, Trash2 } from 'lucide-react';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    // Initial dummy data for first-time use
    const initialData = [
        {
            id: 1,
            title: "New Course Launched",
            description: "Advanced Tajweed Mastery is now available for enrollment.",
            time: "2h ago",
            type: "success",
            icon: 'CheckCircle2',
            read: false,
        },
        {
            id: 2,
            title: "Live Session Reminder",
            description: "Weekly Halqa starts in 30 minutes. Don't forget to join!",
            time: "30m ago",
            type: "info",
            icon: 'Clock',
            read: false,
        },
        {
            id: 3,
            title: "Assignment Feedback",
            description: "Your Arabic Grammar Level 1 submission has been reviewed.",
            time: "1d ago",
            type: "message",
            icon: 'MessageSquare',
            read: true,
        }
    ];

    // Load from local storage or set initial data
    useEffect(() => {
        const saved = localStorage.getItem('alhaq_notifications');
        if (saved) {
            try {
                setNotifications(JSON.parse(saved));
            } catch (e) {
                setNotifications(initialData);
            }
        } else {
            setNotifications(initialData);
        }
    }, []);

    // Save to local storage whenever notifications change
    useEffect(() => {
        if (notifications.length > 0) {
            localStorage.setItem('alhaq_notifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (e, id) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
        localStorage.removeItem('alhaq_notifications');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (iconName) => {
        const icons = { CheckCircle2, Clock, MessageSquare, AlertCircle };
        const IconComp = icons[iconName] || Bell;
        return <IconComp size={18} />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-2xl transition-all group border ${isOpen ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-100'}`}
            >
                <Bell size={20} className={`${!isOpen && 'group-hover:rotate-12'} transition-transform`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in zoom-in-95 fade-in duration-200 origin-top-right">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 px-5 border-b border-slate-50 mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">Alert Hub</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} New Signals</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-[10px] font-bold text-brand hover:underline uppercase tracking-widest">Mark all read</button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest">Clear</button>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Area */}
                    <div className="max-h-[70vh] overflow-y-auto px-2 pb-2 custom-scrollbar">
                        {notifications.length > 0 ? (
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
                                                <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0 ml-4">{notification.time}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                                                {notification.description}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => deleteNotification(e, notification.id)}
                                            className="absolute top-4 right-4 p-1 rounded-lg bg-white/80 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-slate-100"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Zero Signals Found</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Your notification vault is empty.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-slate-50/50 rounded-2xl border-t border-slate-50 flex items-center justify-center">
                        <button className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-brand uppercase tracking-widest transition-all">
                             Audit Exploration <ExternalLink size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
