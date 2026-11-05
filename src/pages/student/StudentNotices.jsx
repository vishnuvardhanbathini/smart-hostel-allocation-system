import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Megaphone, Calendar } from 'lucide-react';

export default function StudentNotices() {
  const { profile } = useAuth();
  const { getNotices } = useDatabase();

  const student = profile;
  const targetAudience = student?.gender === 'Male' ? 'Boys Hostel' : 'Girls Hostel';
  const notices = getNotices().filter(n => n.target_audience === 'All' || n.target_audience === targetAudience);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-cyan-400" />
          <span>Hostel Notices & Campus Circulars</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Official announcements, maintenance schedules, and student residence guidelines
        </p>
      </div>

      <div className="space-y-4">
        {notices.map(notice => {
          let catBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
          if (notice.category === 'Urgent') catBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
          else if (notice.category === 'Maintenance') catBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
          else if (notice.category === 'Event') catBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

          return (
            <div
              key={notice.id}
              className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${catBadge}`}>
                    {notice.category}
                  </span>
                  <h3 className="font-bold text-base text-white">{notice.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {notice.content}
              </p>

              <div className="pt-2 border-t border-navy-800/80 text-[11px] text-slate-400">
                Issued by <strong className="text-white">{notice.author || 'Hostel Administration'}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
