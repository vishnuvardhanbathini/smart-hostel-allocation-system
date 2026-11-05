import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Bell, Check, ExternalLink } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const { getNotificationsByUserId, markNotificationAsRead, markAllNotificationsAsRead } = useDatabase();

  if (!user) return null;

  const notifications = getNotificationsByUserId(user.userId);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            <span>Notifications Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System alerts, application status updates, and hostel allocations
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsAsRead(user.userId)}
            className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-xs font-semibold text-cyan-400 flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 rounded-3xl bg-navy-900 border border-navy-800">
            You have no notifications yet.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-5 rounded-3xl border transition shadow-lg ${
                !n.is_read
                  ? 'bg-navy-900 border-cyan-500/40'
                  : 'bg-navy-900/60 border-navy-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    )}
                    <h3 className="font-bold text-sm text-white">{n.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                </div>

                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              {n.link && (
                <div className="mt-3 pt-3 border-t border-navy-800">
                  <Link
                    to={n.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"
                  >
                    <span>View Related Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
