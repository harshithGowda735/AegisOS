import React from 'react';
import { Star, Clock, Car, Users, Bed, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import SeverityBadge from '../ui/SeverityBadge';

const HospitalCard = ({ hospital, isBest, onSelect, severity }) => {
  // Utility to determine wait time color
  const getWaitTimeColor = (timeStr) => {
    const mins = parseInt(timeStr);
    if (mins <= 15) return 'text-emerald-500';
    if (mins <= 30) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className={`group relative bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border ${isBest ? 'border-indigo-500 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500' : 'border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:border-indigo-200'}`}>
      
      {isBest && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[10px] font-black uppercase px-5 py-2 rounded-full shadow-lg shadow-indigo-600/30 whitespace-nowrap flex items-center gap-2 z-10 tracking-[0.1em] animate-pulse-subtle">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Best Choice
        </div>
      )}

      <div className="flex-1 mt-2">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%]">
            <h3 className="text-2xl font-black text-slate-900 leading-[1.1] mb-2 group-hover:text-indigo-600 transition-colors">{hospital.name}</h3>
            {severity && <SeverityBadge severity={severity} className="mt-1 transform scale-90 origin-left" />}
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50/50 border border-amber-100/50 px-3 py-1.5 rounded-xl text-sm font-black">
            <Star className="w-4 h-4 fill-current" /> {hospital.rating}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-indigo-100/50">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Clock className={`w-4 h-4 ${getWaitTimeColor(hospital.waitTime)}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Wait</span>
            </div>
            <span className="text-lg font-black text-slate-800">{hospital.waitTime}</span>
          </div>

          <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-indigo-100/50">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Car className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Travel</span>
            </div>
            <span className="text-lg font-black text-slate-800">{hospital.distance}</span>
          </div>

          <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-indigo-100/50">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Staff</span>
            </div>
            <span className="text-lg font-black text-slate-800">{hospital.doctorsAvailable} On-call</span>
          </div>

          <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-slate-100/50 transition-colors group-hover:bg-white group-hover:border-indigo-100/50">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Bed className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Beds</span>
            </div>
            <span className="text-lg font-black text-slate-800">{hospital.beds} Open</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => onSelect(hospital)}
        variant={isBest ? 'primary' : 'secondary'}
        className="w-full text-base font-black py-4 rounded-2xl group-hover:shadow-lg transition-all"
        icon={ChevronRight}
      >
        Select Facility
      </Button>

    </div>
  );
};

export default HospitalCard;
