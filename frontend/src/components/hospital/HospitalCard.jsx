import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Users, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Activity,
  UserCheck
} from 'lucide-react';
import Button from '../ui/Button';

const HospitalCard = ({ hospital, isRecommended }) => {
  const navigate = useNavigate();
  const selectHospital = useAppStore(state => state.selectHospital);

  const handleSelect = () => {
    selectHospital(hospital);
    navigate('/booking');
  };

  return (
    <div 
      className={`saas-card relative p-10 flex flex-col h-full ${isRecommended ? 'border-sky-400 ring-2 ring-sky-500/5' : ''}`}
    >
      {isRecommended && (
        <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-sky-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-sky-500/30">
          <ShieldCheck size={12} /> AegisOS Recommended
        </div>
      )}

      <div className="flex-1 mb-10">
        <header className="mb-10">
           <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">
              <Activity size={14} className="text-sky-500" /> Regional Node {hospital.id}
           </div>
           <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{hospital.name}</h3>
        </header>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
               <Users size={12} /> Beds
            </p>
            <p className="text-2xl font-black text-slate-900">{hospital.bedsAvailable}</p>
            <p className="text-[10px] text-emerald-500 font-bold">Optimal Capacity</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
               <UserCheck size={12} /> Staff
            </p>
            <p className="text-2xl font-black text-slate-900">{hospital.doctorsAvailable}</p>
            <p className="text-[10px] text-sky-500 font-bold">On-duty</p>
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-slate-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
               <Clock size={16} className="text-slate-300" /> Wait Time
            </div>
            <span className="font-black text-rose-500">{hospital.waitTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
               <MapPin size={16} className="text-slate-300" /> Travel Time
            </div>
            <span className="font-black text-slate-900">{hospital.travelTime}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSelect}
        variant={isRecommended ? 'primary' : 'secondary'}
        className="w-full py-4 rounded-2xl group shadow-sm"
        icon={ChevronRight}
      >
        Select Facility
      </Button>
    </div>
  );
};

export default HospitalCard;
