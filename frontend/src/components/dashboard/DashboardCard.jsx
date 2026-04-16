import React from 'react';

const DashboardCard = ({ title, value, subtext, icon, trend, trendUp, sparkline: Sparkline }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 group">
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner border border-slate-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 font-black text-xs px-3 py-1.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black text-slate-900 tracking-tight">{value}</span>
          {subtext && <span className="text-slate-500 font-bold text-sm">{subtext}</span>}
        </div>
      </div>

      {Sparkline && (
        <div className="mt-auto pt-6 border-t border-slate-50">
          <Sparkline />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
