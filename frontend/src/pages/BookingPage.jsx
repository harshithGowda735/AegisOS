import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';

import {
  CheckCircle2, MapPin, Clock, Calendar,
  CreditCard, ShieldCheck, ArrowLeft,
  Info, Activity, Sparkles, Siren, Navigation,
  BedDouble, UserCheck, AlertTriangle, Timer,
  FileText, ShieldAlert, ReceiptText, Landmark,
  ChevronRight, Lock, Fingerprint
} from 'lucide-react';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 260, damping: 20 } 
  }
};

const BookingPage = () => {
  const {
    bestHospital, doctors, confirmBooking,
    booking, currentPatientId,
    isAutonomouslyBooked, ambulanceDispatched, severity
  } = useAppStore();
  
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const assignedDoctor = doctors[0] || { name: 'Dr. Ramnik Patel', specialty: 'General Physician' };
  const [fee] = useState(() => Math.floor(Math.random() * 51) + 500); 

  const handleBooking = async () => {
    setIsConfirming(true);
    const success = await confirmBooking({
      doctorName: assignedDoctor.name,
      appointmentType: 'In-person',
      amount: fee + 15, 
    });
    
    if (success) {
      if (Notification.permission === "granted") {
        new Notification("AegisOS - Dispatch Secured", {
          body: severity === 'High' ? "Ambulance dispatched. Tracking live." : "Appointment confirmed and paid."
        });
      }
    }
    setIsConfirming(false);
  };

  const isEmergency = severity === 'High';

  // ── No hospital state ────────────────────────────────────────
  if (!bestHospital && !booking) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white font-sans"
      >
        <div className="max-w-md">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ShieldAlert className="w-16 h-16 text-sky-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter italic">Initializing Dispatch Node...</h2>
          <Button onClick={() => navigate('/')} className="bg-sky-600 hover:bg-sky-500">Return to Aegis Root</Button>
        </div>
      </motion.div>
    );
  }

  // ── Processing State ─────────────────────────────────────────
  if (isConfirming) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-24 h-24 mb-8 relative">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
             className="absolute inset-0 border-4 border-indigo-600/20 rounded-full"
           />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
             className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"
           />
           <CreditCard className="absolute inset-0 m-auto text-indigo-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Aegis Pay Node Active</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 animate-pulse">Securing Clinical Transaction...</p>
      </motion.div>
    );
  }

  // ── SUCCESS VIEW (Post-Payment) ──────────────────────────────
  if (booking) {
    return (
      <div className={`min-h-screen p-4 md:p-14 font-sans flex items-center justify-center transition-colors duration-700 ${isEmergency ? 'bg-rose-50' : 'bg-slate-50'}`}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
        >
          {/* Status Header */}
          <div className={`p-8 md:p-12 text-center ${isEmergency ? 'bg-rose-600' : 'bg-indigo-600'}`}>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
            >
              {isEmergency ? <Siren size={40} className="text-white animate-pulse" /> : <CheckCircle2 size={40} className="text-white" />}
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {isEmergency ? 'Emergency Dispatched' : 'Booking Confirmed'}
            </h1>
            <p className="text-white/80 font-medium mt-2">Transaction ID: TXN-{currentPatientId?.slice(-8).toUpperCase()}</p>
          </div>

          <div className="p-8 md:p-12">
            {/* Original Dispatch Banner Logic */}
            {ambulanceDispatched && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className="bg-rose-50 border border-rose-100 rounded-3xl p-6 mb-10 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Siren size={24} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <p className="text-rose-900 font-bold uppercase text-xs tracking-widest mb-1">Ambulance On-Route</p>
                    <p className="text-rose-700 text-sm font-medium">Unit <span className="font-bold">{ambulanceDispatched.vehicleId}</span> dispatched.</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-rose-400 uppercase">ETA</p>
                   <p className="text-3xl font-black text-rose-600">{ambulanceDispatched.etaMinutes}m</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Facility Details</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600"><MapPin size={24}/></div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">{bestHospital?.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{bestHospital?.distance} from current location</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-indigo-600" />
                    <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Clinical Briefing</h4>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "Digital profile synced. Specialists on standby. Present Triage ID upon arrival."
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Triage ID</span>
                  <span className="font-mono font-bold text-indigo-600">{currentPatientId?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900">₹{fee}</span>
                </div>
                <div className="pt-4">
                  <Button onClick={() => navigate('/health-hub')} className="w-full h-14 rounded-xl bg-slate-900 shadow-xl">Return to Dashboard</Button>
                  <button onClick={() => window.print()} className="w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Download Receipt</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── MAIN CHECKOUT VIEW ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* SaaS Nav */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block">Aegis<span className="text-indigo-600">Health</span></span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-600 border border-emerald-100">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            SYSTEM OPERATIONAL
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 md:py-14 px-4 md:px-12">
        <motion.div 
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16"
        >
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <button onClick={() => navigate('/results')} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Checkout</h1>
            </motion.div>

            {/* Hospital Section */}
            <motion.section variants={itemVariants} className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Selected Facility</h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                      <Sparkles size={12} /> Optimization Recommendation
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">{bestHospital?.name}</h2>
                  </div>
                  {isEmergency && <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl"><Siren size={24}/></div>}
                </div>
                
                <div className="flex flex-wrap gap-4 md:gap-8">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                    <MapPin size={16} className="text-indigo-500"/> {bestHospital?.distance}
                  </div>
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <Clock size={16}/> {bestHospital?.waitTime} Wait
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <BedDouble size={16}/> {bestHospital?.bedsAvailable} Beds
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Scheduling Section */}
            <motion.section variants={itemVariants} className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Priority Window</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Calendar size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Date</p>
                    <p className="font-bold">Today, {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Timer size={20} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Routing</p>
                    <p className="font-bold">Immediate Priority Bay</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Protocol Alert */}
            <motion.div variants={itemVariants} className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex gap-5">
              <div className="shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={20}/>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Security & Clinical Protocols</h4>
                <p className="text-sm text-indigo-700/80 font-medium leading-relaxed mt-1">
                  Your triage code matches {bestHospital?.name} specialty nodes. All telemetry is encrypted with AES-256 standards.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Payment Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Order Summary</h2>
              
              <div className="space-y-5 pb-8 border-b border-slate-100 mb-8">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Consultation Fee</span>
                  <span className="text-slate-900">₹{fee}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400">Service Tax (Node Sync)</span>
                  <span className="text-slate-900">₹15</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                  <span>Aegis Intelligence Rebate</span>
                  <span>– ₹15</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{fee}</p>
                </div>
                <Landmark size={32} className="text-slate-100 mb-1" />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleBooking}
                  isLoading={isConfirming}
                  className={`w-full py-7 rounded-2xl shadow-xl transition-all text-lg font-bold ${isEmergency ? 'bg-rose-600 shadow-rose-200 hover:bg-rose-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  {isEmergency ? 'Confirm Dispatch' : 'Complete Payment'}
                </Button>
              </motion.div>

              <div className="mt-6 flex items-center gap-2 justify-center text-[10px] font-black uppercase text-slate-300 tracking-widest">
                <Lock size={12} /> Secure Triage Payment Node
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default BookingPage;