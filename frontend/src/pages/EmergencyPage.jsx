import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ShieldAlert, 
  Activity,
  Navigation
} from 'lucide-react';
import Button from '../components/ui/Button';

const EmergencyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rose-600 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
      <div className="max-w-2xl w-full page-animate opacity-0">
        <header className="mb-12">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl animate-pulse">
            <ShieldAlert size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 leading-tight">Emergency Dispatch Active</h1>
          <p className="text-rose-100 text-xl font-medium tracking-tight">Immediate medical assistance is required. Node protocol 01-A activated.</p>
        </header>

        <div className="space-y-6 mb-16">
          <button 
            onClick={() => window.location.href = 'tel:108'}
            className="w-full h-24 bg-white text-rose-600 rounded-[2rem] flex items-center justify-center gap-6 text-3xl font-black shadow-2xl hover:scale-[1.02] transition-transform active:scale-95"
          >
            <Phone size={32} /> Call Ambulance (108)
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center gap-4 text-left">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><MapPin size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">Broadcast ID</p>
                <p className="font-bold">Aegis-LOC-8219</p>
              </div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center gap-4 text-left">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Navigation size={20} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-200">ER Routing</p>
                <p className="font-bold">City Central High</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/results')}
          className="flex items-center gap-2 mx-auto text-rose-200 hover:text-white font-bold transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Triage Results
        </button>

        <footer className="mt-20 pt-10 border-t border-white/10">
           <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Activity size={14} /> Aegis Emergency Node Active
           </div>
        </footer>
      </div>
    </div>
  );
};

export default EmergencyPage;
