import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ShieldAlert, 
  Activity,
  Navigation,
  Siren,
  Hospital,
  ShieldCheck,
  TrendingUp,
  Wifi
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const EmergencyPage = () => {
  const navigate = useNavigate();
  const { userLocation, ambulanceDispatched, booking } = useAppStore();
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    // If we have an active booking with ambulance telemetry, use it
    if (ambulanceDispatched?.telemetry) {
      setTelemetry(ambulanceDispatched.telemetry);
    }
  }, [ambulanceDispatched]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      {/* ─── RADAR GRID BACKGROUND ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="radarGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#radarGrid)" />
        </svg>
      </div>

      <div className="max-w-4xl w-full z-10">
        <header className="mb-12 text-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-600/40"
          >
            <ShieldAlert size={40} className="text-white" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Ambulance Terminal</h1>
          <div className="flex items-center justify-center gap-4 text-rose-400 font-bold uppercase tracking-widest text-[10px]">
             <span className="flex items-center gap-1.5"><Wifi size={12}/> Live Sync</span>
             <span className="w-1 h-1 bg-rose-600 rounded-full" />
             <span className="flex items-center gap-1.5 font-black text-rose-500">Mission Active</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 1. Ambulance ↔ Patient */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ambulance to You</p>
              <Siren size={18} className="text-rose-500 animate-pulse" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter mb-1">
                {telemetry?.ambulanceToPatient || '7.2'} <span className="text-xs text-slate-600 uppercase">km</span>
              </p>
              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold">
                 <TrendingUp size={12}/> ETA: {ambulanceDispatched?.etaMinutes || '12'}m
              </div>
            </div>
          </motion.div>

          {/* 2. Ambulance ↔ Hospital (TRIPLE POINT GIS) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-rose-500/30 rounded-[2.5rem] p-8 flex flex-col justify-between ring-2 ring-rose-500/10"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Ambulance to Hub</p>
              <Navigation size={18} className="text-sky-500" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter mb-1">
                 {telemetry?.ambulanceToHospital || '14.1'} <span className="text-xs text-slate-600 uppercase">km</span>
              </p>
              <div className="text-slate-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest">
                 <MapPin size={10}/> Route Secured
              </div>
            </div>
          </motion.div>

          {/* 3. Patient ↔ Hospital */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Your Route to Hub</p>
              <Hospital size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter mb-1">
                 {telemetry?.patientToHospital || '18.4'} <span className="text-xs text-slate-600 uppercase">km</span>
              </p>
              <div className="text-slate-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest">
                 <ShieldCheck size={10}/> Safe Corridor
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
            <button 
              onClick={() => window.location.href = 'tel:108'}
              className="flex-1 h-24 bg-rose-600 hover:bg-rose-500 text-white rounded-[2rem] flex items-center justify-center gap-6 text-3xl font-black shadow-2xl transition-all active:scale-95 shadow-rose-600/20"
            >
              <Phone size={32} /> Dispatch Link (108)
            </button>
            
            <div className="md:w-72 p-8 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-slate-800 flex items-center gap-5">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500"><Activity size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Vitals Sync</p>
                <p className="font-bold text-emerald-400">Connected</p>
              </div>
            </div>
        </div>

        <footer className="pt-10 border-t border-slate-800 text-center">
          <button 
            onClick={() => navigate('/booking')}
            className="flex items-center gap-2 mx-auto text-slate-500 hover:text-white font-bold transition-all group mb-8"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Live Mission Checkout
          </button>
           <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-600">
              <Activity size={12} /> GIS Intelligence Node // AECS-04-TRACK
           </div>
        </footer>
      </div>
    </div>
  );
};

export default EmergencyPage;
