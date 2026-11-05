import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'cyan', subtitle, trend }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400',
    blue: 'from-blue-500/20 to-indigo-600/10 border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-yellow-600/10 border-amber-500/30 text-amber-400',
    rose: 'from-rose-500/20 to-red-600/10 border-rose-500/30 text-rose-400',
    purple: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-400'
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br bg-navy-900 border ${scheme} shadow-lg transition-transform hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-navy-800/80 border border-navy-700/80">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-bold text-emerald-400">{trend}</span>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</div>
      )}
    </div>
  );
}
