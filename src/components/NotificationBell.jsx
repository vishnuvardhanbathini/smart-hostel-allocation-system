import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { user } = useAuth();
  const { getNotificationsByUserId, markNotificationAsRead, markAllNotificationsAsRead } = useDatabase();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const notifications = getNotificationsByUserId(user.userId);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700 transition"
      >
        <Bell className="w-5 h-5 text-cyan-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl p-4 z-50 text-white animate-slide-in">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="font-bold text-sm flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsAsRead(user.userId)}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-navy-800/80 my-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3 rounded-xl transition cursor-pointer hover:bg-navy-800/60 ${
                    !n.is_read ? 'bg-cyan-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline mt-2"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
