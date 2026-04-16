import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';

import {
  CheckCircle2, MapPin, Clock, Calendar,
  CreditCard, ShieldCheck, ArrowLeft,
  Info, Activity, Sparkles, Siren, Navigation,
  BedDouble, UserCheck, AlertTriangle, Timer,
  FileText, ShieldAlert
} from 'lucide-react';

const BookingPage = () => {
  const {
    bestHospital, doctors, confirmBooking,
    booking, currentPatientId,
    isAutonomouslyBooked, ambulanceDispatched, severity
  } = useAppStore();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  const assignedDoctor = doctors[0] || { name: 'Dr. Ramnik Patel', specialty: 'General Physician' };

  const handleBooking = async () => {
    setIsConfirming(true);
    // Simulate payment node handshake
    const success = await confirmBooking({
      doctorName: assignedDoctor.name,
      appointmentType: 'In-person',
    });
    // Add success feedback
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white">
        <div className="max-w-md">
          <ShieldAlert className="w-16 h-16 text-sky-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-black mb-4 tracking-tighter">Initializing Dispatch Node...</h2>
          <Button onClick={() => navigate('/')}>Return to Aegis Root</Button>
        </div>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-24 h-24 mb-8 relative">
           <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
           <CreditCard className="absolute inset-0 m-auto text-sky-400 w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-4 text-sky-400">Aegis Pay Node Active</h2>
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Securing Clinical Transaction & Route...</p>
      </div>
    );
  }

  // ── SUCCESS VIEW ─────────────────────────────────────────────
  if (booking) {
    return (
      <div className={`min-h-screen p-6 md:p-14 font-sans flex items-center justify-center transition-colors duration-500 ${isEmergency ? 'bg-rose-950' : 'bg-slate-50'}`}>
        <div className="max-w-4xl w-full">
          <div className={`rounded-[3rem] p-10 md:p-16 page-animate opacity-0 ${isEmergency ? 'bg-rose-900 border border-rose-800' : 'bg-white shadow-xl'}`}>

            {/* Ambulance Dispatch Banner */}
            {ambulanceDispatched && (
              <div className="bg-rose-500 rounded-3xl p-8 mb-10 flex items-center justify-between border-4 border-white/20 shadow-2xl shadow-rose-500/40">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center shrink-0">
                    <Siren size={32} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg uppercase tracking-widest mb-1">
                      🚑 Ambulance On-Route
                    </p>
                    <p className="text-rose-100 font-medium max-w-sm">
                      Unit <span className="font-black text-white">{ambulanceDispatched.vehicleId}</span> dispatched from nearest hub. 
                    </p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                   <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest">ETA</p>
                   <p className="text-4xl font-black text-white">{ambulanceDispatched.etaMinutes}<span className="text-sm ml-1 font-medium">MIN</span></p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex flex-col items-start mb-10">
                  {isAutonomouslyBooked && (
                    <div className={`inline-flex items-center gap-2 py-1.5 px-6 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${isEmergency ? 'bg-rose-800 text-rose-200' : 'bg-sky-900 text-white shadow-xl'}`}>
                      <Sparkles size={12} /> Autonomous Protocol Success
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl ${isEmergency ? 'bg-rose-800 text-rose-100' : 'bg-emerald-50 text-emerald-600'}`}>
                    {isEmergency ? <Siren size={36} /> : <CheckCircle2 size={40} />}
                  </div>

                  <h1 className={`text-5xl font-black tracking-tighter mb-4 leading-none ${isEmergency ? 'text-white' : 'text-slate-900'}`}>
                    {isEmergency ? 'Emergency Dispatched' : 'Success Confirmed'}
                  </h1>
                  <p className={`font-bold text-lg leading-snug ${isEmergency ? 'text-rose-200' : 'text-slate-500'}`}>
                    Reservation secured at {bestHospital?.name}. Aegis Pay transaction complete.
                  </p>
                </div>

                {/* Patient Briefing */}
                <div className={`p-8 rounded-[2rem] mb-10 border ${isEmergency ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex items-center gap-2 mb-4">
                      <FileText size={16} className="text-sky-500" />
                      <h4 className={`text-[10px] font-black uppercase tracking-widest ${isEmergency ? 'text-rose-400' : 'text-slate-400'}`}>Clinical Briefing Dispatch</h4>
                   </div>
                   <p className={`text-sm italic font-medium leading-relaxed ${isEmergency ? 'text-rose-100' : 'text-slate-600'}`}>
                     "Clinical profile synced with facility node. ER specialists on standby. Present Triage ID upon arrival for priority bypass."
                   </p>
                </div>
              </div>

              {/* Data Snapshot Cards */}
              <div className="space-y-4">
                 <div className={`p-6 rounded-[2rem] flex items-center justify-between group transition-all ${isEmergency ? 'bg-rose-800/50 hover:bg-rose-800' : 'bg-slate-50 hover:bg-white hover:shadow-xl'}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400"><Clock size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Time Frame</p>
                          <p className="font-bold">ASAP • TODAY</p>
                       </div>
                    </div>
                 </div>
                 <div className={`p-6 rounded-[2rem] flex items-center justify-between group transition-all ${isEmergency ? 'bg-rose-800/50 hover:bg-rose-800' : 'bg-slate-50 hover:bg-white hover:shadow-xl'}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400"><MapPin size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Destination</p>
                          <p className="font-bold truncate max-w-[150px]">{bestHospital?.name}</p>
                       </div>
                    </div>
                    <Navigation size={20} className="text-sky-500 opacity-50 group-hover:opacity-100" />
                 </div>
                 <div className={`p-6 rounded-[2rem] flex items-center justify-between group transition-all ${isEmergency ? 'bg-rose-800/50 hover:bg-rose-800' : 'bg-slate-50 hover:bg-white hover:shadow-xl'}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400"><ShieldCheck size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Triage ID</p>
                          <p className="font-black text-sky-500">{currentPatientId?.slice(-6).toUpperCase()}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
              <Button
                onClick={() => navigate('/health-hub')}
                variant={isEmergency ? 'danger' : 'primary'}
                className="rounded-2xl px-12 h-16 w-full md:w-auto text-lg"
              >
                Return to Health Hub
              </Button>
              <button 
                onClick={() => window.print()} 
                className={`text-sm font-black uppercase tracking-widest border-b-2 transition-colors ${isEmergency ? 'text-rose-400 border-rose-800 hover:text-white' : 'text-slate-400 border-slate-100 hover:text-slate-900'}`}
              >
                Download Clinical Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Emergency Mode (Pre-booking) ─────────────────────────────
  if (isEmergency && !booking) {
    return (
      <div className="min-h-screen bg-rose-950 font-sans flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-500 text-white rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
            <Siren size={14} /> Emergency Protocol
          </div>

          <h1 className="text-6xl font-black text-white tracking-tighter mb-4">Critical Alert</h1>
          <p className="text-rose-300 text-lg font-medium mb-10">
            High-severity case detected. Aegis AI is auto-routing to the nearest available emergency facility.
          </p>

          {/* Hospital quick info */}
          <div className="bg-rose-900/60 border border-rose-800 rounded-[2rem] p-8 mb-8 text-left">
            <h3 className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">Emergency Node Selected</h3>
            <p className="text-3xl font-black text-white mb-3">{bestHospital?.name}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-rose-200 font-bold">
                <MapPin size={14} /> {bestHospital?.distance || '—'}
              </div>
              <div className="flex items-center gap-2 text-rose-200 font-bold">
                <Timer size={14} /> {bestHospital?.waitTime || '—'} wait
              </div>
              <div className="flex items-center gap-2 text-rose-200 font-bold">
                <BedDouble size={14} /> {bestHospital?.bedsAvailable} beds available
              </div>
            </div>
          </div>

          <Button
            onClick={handleBooking}
            isLoading={isConfirming}
            className="w-full py-8 text-xl rounded-2xl bg-rose-500 hover:bg-rose-400 text-white shadow-2xl shadow-rose-500/30"
            icon={Siren}
          >
            Call Ambulance & Confirm Booking
          </Button>

          <button
            onClick={() => navigate('/results')}
            className="mt-6 text-rose-400 hover:text-white text-sm font-bold transition-colors"
          >
            ← Back to facility list
          </button>
        </div>
      </div>
    );
  }

  // ── STANDARD CHECKOUT VIEW ───────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 md:p-14">
        <div className="flex items-center gap-6 mb-16">
          <button onClick={() => navigate('/results')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: Facility Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Selected Facility</h3>
              <div className="p-10 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                <div className="inline-flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest mb-4">
                  <CheckCircle2 size={12} /> Optimization Recommendation
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{bestHospital?.name}</h2>
                <div className="flex flex-wrap gap-6 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-1.5"><MapPin size={16} /> {bestHospital?.distance || '—'}</div>
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold"><Clock size={16} /> {bestHospital?.waitTime || '—'} Wait</div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold"><BedDouble size={16} /> {bestHospital?.bedsAvailable} Beds</div>
                  <div className="flex items-center gap-1.5 text-sky-600 font-bold"><UserCheck size={16} /> {bestHospital?.doctorsAvailable} Doctors</div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Scheduling Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Calendar size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Appointment Date</p>
                    <p className="text-lg font-black text-slate-900">Today</p>
                  </div>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Reserved Slot</p>
                    <p className="text-lg font-black text-slate-900">3:00 – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex items-start gap-6">
              <Info className="text-sky-500 mt-1 shrink-0" />
              <div>
                <h4 className="font-black text-sky-900 mb-1">Security & Protocols</h4>
                <p className="text-sm text-sky-700 leading-relaxed font-medium">
                  Your triage code matches {bestHospital?.name} specialty nodes. Present your digital ID at the autonomous check-in terminal.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Payment Sidebar */}
          <div>
            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 sticky top-10">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Payment Summary</h2>
              <div className="space-y-5 pb-8 border-b border-slate-200 mb-8">
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span>Consultation Fee</span><span className="text-slate-900">₹999</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span>Service Tax (18%)</span><span className="text-slate-900">₹199</span>
                </div>
                <div className="flex justify-between items-center text-emerald-500 font-black text-sm">
                  <span>Aegis Discount</span><span>– ₹199</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-black text-slate-900">Total Due</span>
                <span className="text-4xl font-black text-sky-600 tracking-tighter">₹2,999</span>
              </div>

              <Button
                onClick={handleBooking}
                isLoading={isConfirming}
                className="w-full py-6 rounded-2xl shadow-xl shadow-sky-500/20 text-lg mb-8"
                icon={CreditCard}
              >
                Confirm Booking
              </Button>

              <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <ShieldCheck className="text-emerald-500" size={14} /> Secure Triage Node
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
