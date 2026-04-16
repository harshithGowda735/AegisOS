import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin, Clock, Users, UserCheck,
  ChevronRight, ShieldCheck, Activity,
  Wifi, AlertTriangle, BedDouble
} from 'lucide-react';
import Button from '../ui/Button';

// Status config: Green / Yellow / Red
function getStatusConfig(status, crowdScore, bedsAvailable) {
  if (bedsAvailable === 0 || status === 'Full') {
    return { label: 'Full', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500', ring: 'ring-rose-500/10' };
  }
  if (crowdScore >= 70 || bedsAvailable <= 5 || status === 'Limited') {
    return { label: 'Limited', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500', ring: 'ring-amber-500/10' };
  }
  return { label: 'Available', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500', ring: 'ring-emerald-500/10' };
}

const HospitalCard = ({ hospital, isRecommended }) => {
  const navigate = useNavigate();
  const selectHospital = useAppStore(state => state.selectHospital);

  const statusConfig = getStatusConfig(hospital.status, hospital.crowdScore, hospital.bedsAvailable);
  const isDisabled = statusConfig.label === 'Full';

  const handleSelect = () => {
    if (isDisabled) return;
    selectHospital(hospital);
    navigate('/booking');
  };

  // Crowd bar width
  const crowdBarWidth = `${Math.min(hospital.crowdScore || 0, 100)}%`;

  return (
    <div
      className={`relative bg-white rounded-[2rem] border transition-all duration-300 flex flex-col overflow-hidden
        ${isRecommended
          ? `border-sky-300 shadow-xl shadow-sky-500/10 ring-2 ${statusConfig.ring}`
          : 'border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200'}
        ${isDisabled ? 'opacity-70' : ''}
      `}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute top-0 right-6 -translate-y-1/2 px-4 py-1.5 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-sky-500/30 z-10">
          <ShieldCheck size={11} /> AegisOS Recommended
        </div>
      )}

      {/* Status stripe */}
      <div className={`h-1 w-full ${statusConfig.dot}`} />

      <div className="p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">
              <Activity size={12} className="text-sky-400" />
              Regional Node
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">{hospital.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
              <MapPin size={10} /> {hospital.address}
            </p>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} shrink-0`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
            {statusConfig.label}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-2">
              <BedDouble size={11} /> Beds Available
            </div>
            <p className={`text-2xl font-black ${hospital.bedsAvailable === 0 ? 'text-rose-500' : 'text-slate-900'}`}>
              {hospital.bedsAvailable}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Slots Open</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-2">
              <UserCheck size={11} /> Doctors
            </div>
            <p className={`text-2xl font-black ${hospital.doctorsAvailable === 0 ? 'text-rose-500' : 'text-slate-900'}`}>
              {hospital.doctorsAvailable}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">On-Duty</p>
          </div>
        </div>

        {/* Live Crowd Bar (OpenCV) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
              <Wifi size={10} className="text-sky-400" /> Crowd Level (Live)
            </div>
            <span className={`text-[10px] font-black ${statusConfig.text}`}>
              {hospital.crowdScore || 0}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                (hospital.crowdScore || 0) >= 75 ? 'bg-rose-400' :
                (hospital.crowdScore || 0) >= 50 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: crowdBarWidth }}
            />
          </div>
          <p className="text-[9px] text-slate-400 font-medium mt-1">
            {hospital.crowdCount || 0} people detected in waiting area
          </p>
        </div>

        {/* Travel + Wait */}
        <div className="flex gap-6 mb-6 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <MapPin size={14} className="text-slate-300" />
            <span>{hospital.distance || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <Clock size={14} className={statusConfig.text} />
            <span className={statusConfig.text}>{hospital.waitTime || '—'} wait</span>
          </div>
        </div>

        {/* Action */}
        {isDisabled ? (
          <div className="flex items-center gap-2 justify-center py-4 bg-rose-50 rounded-2xl text-rose-500 text-xs font-black uppercase tracking-widest border border-rose-100">
            <AlertTriangle size={14} /> Facility At Capacity
          </div>
        ) : (
          <Button
            onClick={handleSelect}
            variant={isRecommended ? 'primary' : 'secondary'}
            className="w-full py-4 rounded-2xl"
            icon={ChevronRight}
          >
            Select Facility
          </Button>
        )}
      </div>
    </div>
  );
};

export default HospitalCard;
