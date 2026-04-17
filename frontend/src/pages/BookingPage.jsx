import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import GoogleMap from '../components/ui/GoogleMap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  CheckCircle2, MapPin, Clock, Calendar,
  CreditCard, ShieldCheck, ArrowLeft,
  Info, Activity, Sparkles, AlertTriangle, Navigation,
  BedDouble, UserCheck, Timer,
  FileText, ShieldAlert, ReceiptText, Landmark,
  ChevronRight, Lock, Fingerprint, Hospital
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
  const [isConfirming, setIsConfirming] = React.useState(false);
  const assignedDoctor = doctors[0] || { name: 'Dr. Ramnik Patel', specialty: 'General Physician' };
  const [fee] = React.useState(100); 
  const receiptRef = useRef(null);
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

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      // Ensure element is temporary "visible" for capture
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AegisOS-Bill-${currentPatientId?.slice(-6).toUpperCase()}.pdf`);
    } catch (error) {
      console.error("Receipt generation failed:", error);
    }
  };

  // ── No hospital state ────────────────────────────────────────
  if (!bestHospital && !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <ShieldAlert size={64} className="text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Routing</h2>
          <p className="text-slate-500 mb-8">No hospital routing session detected. Please return to the symptom triage page.</p>
          <Button onClick={() => navigate('/triage')} className="w-full">Start Triage Analysis</Button>
        </div>
      </div>
    );
  }

  // ── LOADING STATE ────────────────────────────────────────────
  if (isConfirming) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"
      >
         <div className="w-24 h-24 relative mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
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
              {isEmergency ? <AlertTriangle size={40} className="text-white animate-pulse" /> : <CheckCircle2 size={40} className="text-white" />}
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {isEmergency ? 'Emergency Dispatched' : 'Booking Confirmed'}
            </h1>
            <p className="text-white/80 font-medium mt-2">Transaction ID: TXN-{currentPatientId?.slice(-8).toUpperCase()}</p>
          </div>

          <div className="p-8 md:p-12">
            {/* 🛰️ Triple-Point GIS Telemetry Node */}
            {ambulanceDispatched && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                {/* 1. Ambulance ↔ Patient */}
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white">
                      <Activity size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-rose-400 mb-1">Ambulance to You</p>
                      <p className="text-2xl font-black text-rose-600">{ambulanceDispatched.telemetry?.ambulanceToPatient || '—'} <span className="text-xs">km</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-rose-300">ETA</p>
                    <p className="text-sm font-black text-rose-500">{ambulanceDispatched.etaMinutes}m</p>
                  </div>
                </div>

                {/* 2. Ambulance ↔ Hospital (Truck Icon) */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Ambulance to Hub</p>
                      <p className="text-2xl font-black text-slate-900">{ambulanceDispatched.telemetry?.ambulanceToHospital || '—'} <span className="text-xs">km</span></p>
                    </div>
                  </div>
                  <Activity size={16} className="text-sky-500 animate-pulse" />
                </div>

                {/* 3. Patient ↔ Hospital */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <Hospital size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Your Route to Hub</p>
                      <p className="text-2xl font-black text-indigo-900">{ambulanceDispatched.telemetry?.patientToHospital || '—'} <span className="text-xs">km</span></p>
                    </div>
                  </div>
                  <ShieldCheck size={16} className="text-indigo-400" />
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
                  <div className="mt-4 h-48">
                    <GoogleMap 
                      center={bestHospital?.coordinates || { lat: 12.9716, lng: 77.5946 }} 
                      zoom={15}
                      markers={[{ position: bestHospital?.coordinates, title: bestHospital?.name }]}
                    />
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
                  {isEmergency && (
                    <Button onClick={() => navigate('/emergency')} className="w-full h-14 rounded-xl bg-sky-600 shadow-xl mb-3">Track Live Dispatch</Button>
                  )}
                  <Button onClick={() => navigate('/health-hub')} className="w-full h-14 rounded-xl bg-slate-900 shadow-xl">Return to Dashboard</Button>
                  <button onClick={downloadReceipt} className="w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Download Professional Receipt</button>
                </div>

                {/* Hidden Receipt Template - Made renderable but out of view */}
                <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                  <div ref={receiptRef} style={{ padding: '64px', backgroundColor: '#ffffff', color: '#0f172a', width: '800px', fontFamily: 'sans-serif' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '4px solid #0f172a', paddingBottom: '32px', marginBottom: '40px' }}>
                        <div>
                           <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '8px' }}>AEGIS<span style={{ color: '#4f46e5' }}>OS</span></h1>
                           <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Medical Care & Clinical Intelligence</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Appointment Bill</h2>
                           <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>ID: TXN-{currentPatientId?.slice(-8).toUpperCase()}</p>
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>
                        <div>
                           <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '16px' }}>Patient Information</h3>
                           <p style={{ fontWeight: '900', fontSize: '20px' }}>{booking?.patientName || 'Clinical Subject'}</p>
                           <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>UID: {currentPatientId}</p>
                           <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>Status: {severity} Priority</p>
                        </div>
                        <div>
                           <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '16px' }}>Medical Facility</h3>
                           <p style={{ fontWeight: '900', fontSize: '20px' }}>{bestHospital?.name}</p>
                           <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>Assigned: {assignedDoctor.name}</p>
                           <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>Dept: {assignedDoctor.specialty}</p>
                        </div>
                     </div>

                     <div style={{ backgroundColor: '#f8fafc', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
                        <table style={{ width: '100%' }}>
                           <thead>
                              <tr style={{ borderBottom: '1px solid #e2e8f0', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>
                                 <th style={{ textAlign: 'left', paddingBottom: '16px' }}>Description</th>
                                 <th style={{ textAlign: 'right', paddingBottom: '16px' }}>Quantity</th>
                                 <th style={{ textAlign: 'right', paddingBottom: '16px' }}>Amount</th>
                              </tr>
                           </thead>
                           <tbody style={{ fontSize: '14px', fontWeight: 'bold' }}>
                              <tr>
                                 <td style={{ padding: '16px 0' }}>Clinical Consultation & Triage</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right' }}>1</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right' }}>₹{fee}.00</td>
                              </tr>
                              <tr>
                                 <td style={{ padding: '16px 0', color: '#059669' }}>Aegis AI Optimization Rebate</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right' }}>1</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right', color: '#059669' }}>-₹15.00</td>
                              </tr>
                              <tr>
                                 <td style={{ padding: '16px 0' }}>System Service Node Tax</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right' }}>1</td>
                                 <td style={{ padding: '16px 0', textAlign: 'right' }}>₹15.00</td>
                              </tr>
                           </tbody>
                           <tfoot>
                              <tr style={{ borderTop: '2px solid #0f172a' }}>
                                 <td style={{ paddingTop: '24px', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Total Payable</td>
                                 <td></td>
                                 <td style={{ paddingTop: '24px', textAlign: 'right', fontSize: '30px', fontWeight: '900', letterSpacing: '-0.05em' }}>₹{fee}.00</td>
                              </tr>
                           </tfoot>
                        </table>
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
                           Digital Transaction Verified
                        </div>
                        <div>Authorized by AegisOS Governance Node</div>
                     </div>
                  </div>
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
                  {isEmergency && <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl"><AlertTriangle size={24}/></div>}
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