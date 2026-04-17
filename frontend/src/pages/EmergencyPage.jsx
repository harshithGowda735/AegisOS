import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Activity,
  Navigation,
  Clock,
  Zap,
  Volume2,
  Hospital as HospitalIcon,
  Truck,
  User,
  MessageSquare,
  Bot,
  AlertTriangle
} from 'lucide-react';
import AmbulanceMap from '../components/AmbulanceMap';
import { useAppStore } from '../store/useAppStore';
import { ambulanceService } from '../services/ambulanceService';
import { hospitalService } from '../services/hospitalService';

const EmergencyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { userLocation } = useAppStore();
  
  const [dispatch, setDispatch] = useState(null);
  const [fleet, setFleet] = useState([]);
  const [pendingPatients, setPendingPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAnnouncedStatus, setLastAnnouncedStatus] = useState('');
  const [isFleetMode, setIsFleetMode] = useState(false);
  const [showTacticalAlert, setShowTacticalAlert] = useState(false);
  
  const synth = window.speechSynthesis;
  const audioContext = useRef(null);
  const patientLoc = userLocation || { lat: 12.9716, lng: 77.5946 };

  const announceStatus = (status, eta) => {
    let msg = `Dispatch status: ${status}.`;
    if (status === 'Dispatched') msg = `Ambulance dispatched. Est Arrival: ${eta} minutes.`;
    if (status === 'Enroute') msg = `Patient onboard. Enroute to hospital.`;
    if (status === 'Arrived') msg = `Ambulance arrived at facility.`;
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    synth.speak(utterance);
  };

  const playTacticalPing = () => {
    if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioContext.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.5);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bookingId) {
          const data = await ambulanceService.getDispatchStatus(bookingId);
          setDispatch(data);
          if (data && data.status !== lastAnnouncedStatus) {
            announceStatus(data.status, data.etaMins);
            setLastAnnouncedStatus(data.status);
          }
          setIsFleetMode(false);
        } else {
          const fleetData = await ambulanceService.getAllAmbulances();
          setFleet(fleetData);
          setIsFleetMode(true);
          
          try {
            const bookingsData = await hospitalService.getRecentBookings();
            const validBookings = bookingsData.filter(b => b.paymentStatus === 'Paid').slice(0, 5);
            
            if (validBookings.length > pendingPatients.length && pendingPatients.length > 0) {
                setShowTacticalAlert(true);
                playTacticalPing();
                setTimeout(() => setShowTacticalAlert(false), 8000);
            }
            setPendingPatients(validBookings);
          } catch(e) {}
        }
        const hospData = await hospitalService.getHospitals();
        setHospitals(hospData.slice(0, 4));
      } catch (err) {} finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [bookingId, lastAnnouncedStatus, pendingPatients.length]);

  const handleHospitalSelect = async (hospitalId) => {
    if (dispatch) {
      try {
        await ambulanceService.updateDestination(dispatch.vehicleId, hospitalId);
        const updatedDispatch = await ambulanceService.getDispatchStatus(bookingId);
        setDispatch(updatedDispatch);
      } catch (err) {}
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a1120] flex items-center justify-center text-white font-black text-2xl uppercase tracking-widest animate-pulse">Initializing GIS Nexus...</div>;

  const tickerText = `🚨 SYSTEM ONLINE: AegisOS GIS Node Initialized • 📡 ACTIVE UNITS: ${fleet.length} • 🏥 HUB: Dr. Chandramma Dayananda Sagar Harohalli is LIVE • ⚠️ PENDING RESCUES: ${pendingPatients.length} • 🛰️ SATELLITE: Link Stable • ${dispatch ? `🚨 ACTIVE DISPATCH: ${dispatch.vehicleId} Enroute to Patient • ` : ''} ⚡ Aegis Intelligence Nexus Active`;

  return (
    <div className="min-h-screen bg-[#0a1120] flex flex-col text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* ─── TACTICAL ALERT BANNER ─── */}
      {showTacticalAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] w-full max-w-xl animate-bounce">
           <div className="mx-4 bg-rose-600/90 backdrop-blur-xl border-2 border-rose-400 p-6 rounded-[2rem] shadow-[0_0_50px_rgba(225,29,72,0.4)] flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                 <AlertTriangle size={32} className="text-white" />
              </div>
              <div className="flex-1">
                 <h2 className="text-xl font-black tracking-tighter uppercase italic">Rescue Signal Detected</h2>
                 <p className="text-white/80 text-xs font-bold tracking-widest uppercase">Immediate Dispatch Required • Aegis Sentinel Alert</p>
              </div>
              <button onClick={() => setShowTacticalAlert(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                 <ArrowLeft className="rotate-90" size={20} />
              </button>
           </div>
        </div>
      )}

      {/* ─── TOP MARQUEE ─── */}
      <div className="w-full bg-[#0d1b35] border-b border-white/5 text-cyan-400 py-3 sticky top-0 z-[2500] overflow-hidden backdrop-blur-xl">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4">{tickerText}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4">{tickerText}</span>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
            
            {/* ─── LEFT SIDEBAR ─── */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <header className="flex items-center gap-4 mb-2">
                    <button onClick={() => navigate('/')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><ArrowLeft size={18} /></button>
                    <h1 className="text-xl font-black tracking-tight">{isFleetMode ? 'Fleet Terminal' : 'Live Mission'}</h1>
                </header>

                {/* Fleet Nodes Card */}
                <div className="p-8 rounded-[2rem] bg-[#10b981] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <Truck size={24} className="text-white" />
                   </div>
                   <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">FLEET NODES</p>
                   <h2 className="text-4xl font-black tracking-tighter">{fleet.length} Active</h2>
                </div>

                {/* Real-time Fleet Log */}
                <div className="bg-[#111c31] border border-white/5 rounded-[2rem] p-6 flex flex-col gap-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/5 pb-4">REAL-TIME FLEET LOG</h3>
                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {fleet.map(amb => (
                        <div key={amb._id} className="flex items-center justify-between group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${amb.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                              <div>
                                 <p className="font-black text-sm text-slate-200">{amb.vehicleId}</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase">{amb.vehicleType} • {amb.speed} KM/H</p>
                              </div>
                           </div>
                           <div className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${amb.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {amb.status}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Pending Rescues (Next Patients) */}
                <div className="bg-[#111c31] border border-white/5 rounded-[2rem] p-6 flex flex-col gap-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 border-b border-white/5 pb-4">PENDING RESCUES (NEXT PATIENTS)</h3>
                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {pendingPatients.length > 0 ? pendingPatients.map(patient => (
                        <div key={patient._id} className="flex items-center justify-between p-3 bg-white/2 rounded-2xl hover:bg-white/5 transition-all">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                                 <User size={18} />
                              </div>
                              <div>
                                 <p className="font-black text-sm">{patient.patientName}</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase">Target: {patient.hospitalName.substring(0, 15)}...</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => navigate(`/emergency?bookingId=${patient.bookingId}`)}
                             className="bg-cyan-500 text-white text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95"
                           >
                             PICKUP
                           </button>
                        </div>
                      )) : (
                        <div className="py-4 text-center">
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Active Distress</p>
                        </div>
                      )}
                   </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="lg:col-span-3 flex flex-col gap-8">
                {/* LARGE MAP */}
                <div className="h-[600px] w-full rounded-[3rem] overflow-hidden border border-white/5 relative shadow-2xl">
                    <AmbulanceMap 
                      ambulanceLoc={dispatch ? dispatch.location : null}
                      patientLoc={isFleetMode ? null : (dispatch?.patientLocation || patientLoc)}
                      hospitalLoc={dispatch ? dispatch.hospitalLocation : null}
                      hospitals={hospitals}
                      fleet={isFleetMode ? fleet : []}
                      isFleetMode={isFleetMode}
                    />
                    
                    {/* Map Meta Overlay */}
                    <div className="absolute top-8 left-8 z-[1000]">
                       <div className="flex items-center gap-3 px-6 py-3 bg-[#0a1120]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-200">AEGIS FLEET GIS SYNCING</span>
                       </div>
                    </div>

                    {/* Legend Overlay */}
                    <div className="absolute top-8 right-8 z-[1000]">
                       <div className="p-5 bg-[#0a1120]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl space-y-3">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">AMBULANCE</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">PATIENT</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">HOSPITAL</span>
                          </div>
                       </div>
                    </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Backup Hospital nodes */}
                    <div className="bg-[#111c31] border border-white/5 rounded-[3rem] p-10">
                       <div className="flex items-center gap-4 mb-10">
                          <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400">
                             <HospitalIcon size={24} />
                          </div>
                          <h3 className="text-xl font-black tracking-tight">Backup Hospital nodes</h3>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          {hospitals.map(h => {
                            const isTarget = dispatch && dispatch.hospitalId === h._id;
                            return (
                              <div 
                                key={h._id} 
                                onClick={() => handleHospitalSelect(h._id)}
                                className={`p-6 bg-[#0a1120]/40 rounded-[2rem] border transition-all cursor-pointer group ${isTarget ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-white/5 hover:border-sky-500/30'}`}
                              >
                                 <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isTarget ? 'text-cyan-400' : 'text-slate-400 group-hover:text-sky-400'}`}>{h.name}</p>
                                 <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                       <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${isTarget ? 'bg-cyan-500 text-white' : 'bg-sky-500/10 text-sky-500'}`}>
                                         {isTarget ? 'TARGET' : `${h.beds?.reduce((s,b)=>s+b.available,0)} BEDS AVAIL`}
                                       </span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">12 MINS WAIT</span>
                                 </div>
                              </div>
                            );
                          })}
                       </div>
                    </div>

                    {/* Aegis Intelligence Nexus */}
                    <div className="bg-[#111c31] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                       
                       <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-center gap-6 mb-10">
                             <div className="relative">
                                <Activity size={32} className="text-blue-500 animate-pulse" />
                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse" />
                             </div>
                          </div>

                          <h3 className="text-xl font-black tracking-tight mb-4">AEGIS INTELLIGENCE NEXUS</h3>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px]">
                             Autonomous GIS routing active. Cross-referencing city-wide congestion with clinical stress scores. Satellite uplink protocol <span className="text-slate-200">v4.2-Stable</span>.
                          </p>
                          
                          {/* Visual Nexus Pulse */}
                          <div className="mt-auto pt-8 flex items-end gap-1">
                             {[...Array(12)].map((_, i) => (
                               <div 
                                 key={i} 
                                 className="w-1 bg-blue-500/30 rounded-full animate-nexus-pulse" 
                                 style={{ 
                                   height: `${Math.random() * 40 + 20}px`,
                                   animationDelay: `${i * 0.1}s`
                                 }} 
                               />
                             ))}
                          </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default EmergencyPage;
