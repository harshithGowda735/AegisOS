import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldAlert, 
  Phone, 
  User, 
  Activity, 
  Send, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Mic,
  Volume2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const PatientEmergencyTerminal = () => {
  const navigate = useNavigate();
  const { processSymptoms, isLoading, allHospitals, setBooking, setAmbulanceDispatched, setUserLocation } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-acquire high-precision location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
        },
        () => setUserLocation({ lat: 12.9716, lng: 77.5946 })
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.description) return;

    setIsSubmitting(true);
    
    try {
      await processSymptoms(formData.description);
      
      const bestHospital = allHospitals?.[0] || { 
        name: 'Harohalli CDSIMER', 
        _id: '67b09c80d55e82531065715e' // A valid ID from seeding
      };

      const response = await axios.post('http://localhost:3000/api/hospitals/book', {
        hospitalId: bestHospital._id,
        hospitalName: bestHospital.name,
        name: formData.name,
        severity: 'High',
        userLocation: userLocation || { lat: 12.9716, lng: 77.5946 }, 
        amount: 100
      });

      if (response.data.success) {
        setBooking(response.data.data);
        if (response.data.ambulanceAssigned) {
          setAmbulanceDispatched(response.data.ambulanceAssigned);
        }
        setTimeout(() => navigate(`/emergency?bookingId=${response.data.data.bookingId}`), 1500);
      }
    } catch (err) {
      navigate('/emergency');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 font-sans flex flex-col overflow-x-hidden">
      
      {/* ─── BACKGROUND SYSTEM (Matches PortalPage) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-50 blur-[120px] opacity-60" />
        <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-sky-50 blur-[100px] opacity-60" />
      </div>

      <nav className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center px-10 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white">
            <ShieldAlert size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">Aegis<span className="text-rose-600">Emergency</span></span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl w-full">
          <header className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-950">
              Immediate <span className="text-rose-600">Rescue</span> Entry.
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-lg leading-relaxed">
              Fast-entry terminal for urgent distress. No account required. AI dispatches nearest units instantly.
            </p>
          </header>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50"
          >
            {isSubmitting ? (
              <div className="py-20 text-center space-y-8">
                 <div className="w-20 h-20 border-4 border-rose-600 border-t-transparent rounded-full mx-auto animate-spin" />
                 <div>
                    <h2 className="text-2xl font-black text-rose-600 uppercase tracking-tighter italic">Initializing Satellite Dispatch</h2>
                    <p className="text-slate-500 font-bold tracking-widest text-[10px] mt-2 animate-pulse">Syncing GIS Proximity Node...</p>
                 </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                         <User size={12}/> Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:border-rose-300 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                         <Phone size={12}/> Contact Number
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:border-rose-300 focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-4 flex items-center gap-2">
                       <AlertCircle size={12}/> Explain Distress
                    </label>
                    <textarea 
                      required
                      placeholder="Describe symptoms or incident for AI triage..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 font-bold text-lg text-slate-900 placeholder:text-slate-300 outline-none focus:border-rose-300 focus:bg-white transition-all shadow-inner resize-none"
                    />
                 </div>

                 <button 
                   type="submit"
                   className="w-full h-20 bg-rose-600 hover:bg-rose-700 text-white rounded-[2rem] flex items-center justify-center gap-6 text-xl font-black shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                 >
                   <span>REQUEST IMMEDIATE RESCUE</span>
                   <ArrowRight size={24} />
                 </button>
              </form>
            )}

            <div className="mt-10 flex items-center justify-between px-4 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-400">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Aegis Core Sync Active</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition-all">
                     <Mic size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-sky-50 hover:text-sky-600 transition-all">
                     <Volume2 size={18} />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="h-20 flex items-center justify-center border-t border-slate-100 relative z-20">
         <button 
           onClick={() => navigate('/')}
           className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-950 transition-all"
         >
           Return to Patient Portal
         </button>
      </footer>
    </div>
  );
};

export default PatientEmergencyTerminal;
