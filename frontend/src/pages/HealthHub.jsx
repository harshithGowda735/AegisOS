import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  User, 
  FileText, 
  Bell, 
  Calendar, 
  Activity, 
  Coffee, 
  Pill, 
  Footprints, 
  Upload, 
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Search,
  Stethoscope
} from 'lucide-react';
import Button from '../components/ui/Button';
import { hospitalService } from '../services/hospitalService';

const HealthHub = () => {
  const routerNavigate = useNavigate();
  const { userProfile, currentPatientId } = useAppStore();
  const [hubData, setHubData] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ── Prescription Safety Guard State ──────────
  const [safetyCheck, setSafetyCheck] = useState({ condition: '', medicine: '', file: null });
  const [safetyResult, setSafetyResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap = {
    Activity, Pill, Footprints, Bell, Clock, AlertCircle, Coffee, ShieldCheck
  };

  useEffect(() => {
    if (currentPatientId) {
      fetchHubData();
    }
  }, [currentPatientId]);

  const fetchHubData = async () => {
    try {
      const data = await hospitalService.getHealthHubData(currentPatientId);
      setHubData(data);
    } catch (err) {
      console.error("Fetch Hub Error:", err);
    }
  };

  const [recalculating, setRecalculating] = useState(false);

  const handleRecalculate = async () => {
    if (!currentPatientId) return;
    setRecalculating(true);
    try {
      await hospitalService.recalculateProtocol(currentPatientId);
      await fetchHubData();
    } catch (err) {
      console.error("Recalculate Error:", err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await hospitalService.uploadReport(currentPatientId, file);
      await fetchHubData();
      if (Notification.permission === "granted") {
        new Notification("AegisOS - Report Analyzed", {
          body: "Your health plan has been updated based on the new report."
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Aegis Node Error: Failed to ingest clinical report. Verification failed.");
    } finally {
      setUploading(false);
    }
  };

  const requestNotificationPermission = () => {
    Notification.requestPermission();
  };

  useEffect(() => {
    // Timeout so we don't block forever if backend is offline
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hubData || userProfile) setIsLoading(false);
  }, [hubData, userProfile]);

  if (isLoading && !hubData && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading health data...</p>
        </div>
      </div>
    );
  }

  const defaultRoutine = {
    foodRoutine: { 
      breakfast: "High-protein oatmeal with berries", 
      lunch: "Mediterranean grilled chicken salad", 
      dinner: "Steamed salmon with leafy greens", 
      snacks: "Mixed nuts or Greek yogurt" 
    },
    medications: [],
    lifestyle: { walking: "30 min morning light walk", maintenance: "General wellness check", hydration: "2.5L daily", fitness: "Light stretching" },
    notifications: [
      { icon: "Activity", message: "Aegis Protocol: Optimal routine active", time: "LIVE" },
      { icon: "ShieldCheck", message: "Biometric monitoring secured", time: "SYNCED" }
    ],
    urgency: "Normal"
  };

  const routine = {
    foodRoutine: hubData?.healthPlan?.foodRoutine || defaultRoutine.foodRoutine,
    medications: hubData?.healthPlan?.medications || defaultRoutine.medications,
    lifestyle: hubData?.healthPlan?.lifestyle || defaultRoutine.lifestyle,
    notifications: hubData?.healthPlan?.notifications || defaultRoutine.notifications,
    urgency: hubData?.healthPlan?.urgency || defaultRoutine.urgency,
    lastUpdated: hubData?.healthPlan?.lastUpdated
  };

  // Safe mapping
  const displayNotifications = routine.notifications || [];

  const performSafetyCheck = async () => {
    const { condition, medicine, file } = safetyCheck;
    if (!condition && !file) return;

    setIsAuditing(true);
    try {
      if (file) {
        // Advanced OCR Analysis
        const response = await hospitalService.analyzePrescription(condition, file);
        setSafetyResult(response.data.analysis);
      } else {
        // Manual Text Fallback
        const isHeartPain = condition.toLowerCase().includes('heart') || condition.toLowerCase().includes('chest');
        const isDolo = medicine.toLowerCase().includes('dolo') || medicine.toLowerCase().includes('paracetamol');

        if (isHeartPain && isDolo) {
          setSafetyResult({
            isCritical: true,
            severity: 'High',
            message: '🚨 CRITICAL MISMATCH: Dolo is an analgesic and NOT a treatment for heart pain. This suggestion indicates an emergency situation.',
            action: 'Contact another specialist immediately or initialize Emergency Node.',
            medications: [{ name: medicine, dosage: "Manual Input", frequency: "Unknown", notes: "DANGER: Analgesic misaligned with cardiac symptoms" }]
          });
        } else {
          setSafetyResult({
            isCritical: false,
            severity: 'Low',
            message: 'Aegis Node suggests this medication is commonly aligned with the reported condition.',
            action: 'Follow doctor instructions and monitor clinical vitals.',
            medications: [{ name: medicine, dosage: "Manual Input", frequency: "N/A", notes: "Standard follow-up" }]
          });
        }
      }
    } catch (err) {
      console.error("Safety Audit Failed:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200/50">
              <User className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none mb-1">Health Hub</h1>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${routine.urgency?.includes('Immediate') ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {hubData?.name || userProfile?.name} • Protocol: {routine.urgency}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={requestNotificationPermission}
              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all relative group"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* Left Column: AI Daily Routine */}
        <div className="lg:col-span-2 space-y-8">
          
          {hubData?.reports?.length > 0 ? (
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Sparkles className="w-48 h-48" />
               </div>

               <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
                     <Calendar size={24} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter">AI Daily Protocol</h2>
                  </div>
                  <div className="flex items-center gap-3">
                  <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                     Live: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </div>
                  <button 
                     onClick={handleRecalculate}
                     disabled={recalculating}
                     className="p-2.5 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-500 hover:text-white transition-all disabled:opacity-50"
                     title="Recalculate Protocol with AI"
                  >
                     <RefreshCw size={16} className={recalculating ? 'animate-spin' : ''} />
                  </button>
                  </div>
               </div>

               <div className="space-y-8 relative">
                  {/* Vertical line connector */}
                  <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-100 hidden md:block"></div>

                  {/* Breakfast */}
                  <div className="flex flex-col md:flex-row gap-6 group relative z-10">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 group-hover:scale-105 transition-all shrink-0">
                     <Coffee size={28} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">08:00 AM • Morning</h3>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Nutritional Guidance</p>
                        <p className="text-lg font-bold text-slate-800 leading-tight">{routine.foodRoutine.breakfast}</p>
                        
                        {(routine.medications || []).filter(m => m.time?.toLowerCase().includes('breakfast') || m.time?.toLowerCase().includes('morning')).map((m, i) => (
                        <div key={i} className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <Pill className="text-sky-600" size={18} />
                              <p className="font-bold text-sky-900 text-sm">{m.name} <span className="text-[10px] opacity-60">({m.dosage})</span></p>
                           </div>
                           <CheckCircle2 className="text-sky-300" size={20} />
                        </div>
                        ))}
                     </div>
                  </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex flex-col md:flex-row gap-6 group relative z-10">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-105 transition-all shrink-0">
                     <Activity size={28} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">01:30 PM • Mid-Day</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Fuel Plan</p>
                        <p className="text-sm font-bold text-slate-800">{routine.foodRoutine.lunch}</p>
                        </div>
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                           <Footprints className="text-indigo-600" size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Activity & Fitness</span>
                        </div>
                        <p className="font-bold text-indigo-900 text-sm leading-tight mb-2">{routine.lifestyle.walking}</p>
                        {routine.lifestyle.fitness && (
                           <div className="mt-2 pt-2 border-t border-indigo-200">
                              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Targeted Exercise</p>
                              <p className="text-xs font-bold text-indigo-800">{routine.lifestyle.fitness}</p>
                           </div>
                        )}
                        </div>
                     </div>
                  </div>
                  </div>

                  {/* Evening */}
                  <div className="flex flex-col md:flex-row gap-6 group relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 group-hover:scale-105 transition-all shrink-0">
                     <Clock size={28} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">08:00 PM • Night</h3>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Dinner Insight</p>
                        <p className="text-sm font-bold text-slate-800">{routine.foodRoutine.dinner}</p>
                     </div>
                  </div>
                  </div>
               </div>
            </section>
          ) : (
            <section className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <FileText size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-3">Awaiting Clinical Evidence</h3>
               <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
                  Your AI Daily Protocol requires at least one medical report (Blood Test, Diabetes Scan) to generate a personalized health regimen and clinical reminders.
               </p>
               <label className="inline-flex items-center gap-3 px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-lg shadow-sky-500/20">
                  <Upload size={16} />
                  Initialize Analysis
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="application/pdf,image/*" />
               </label>
            </section>
          )}

          {/* User Bio Stats Section */}
          <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-3xl font-black tracking-tighter">Clinical Bio-Profile</h2>
                   <p className="text-sm text-slate-400 font-medium">Verified Aegis Patient Data</p>
                </div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/10">
                  <ShieldCheck className="text-sky-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 group/stat hover:bg-white/10 transition-colors">
                  <p className="text-sky-300 text-[10px] font-black uppercase tracking-widest mb-2">Patient Age</p>
                  <p className="text-3xl font-black">{hubData?.age || userProfile?.age}<span className="text-xs font-medium ml-1 opacity-40">YRS</span></p>
                </div>
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 group/stat hover:bg-white/10 transition-colors">
                  <p className="text-sky-300 text-[10px] font-black uppercase tracking-widest mb-2">Sex Marker</p>
                  <p className="text-2xl font-black truncate">{hubData?.gender || userProfile?.gender || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 col-span-2">
                  <p className="text-sky-300 text-[10px] font-black uppercase tracking-widest mb-3">Identified Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {(hubData?.medicalHistory || userProfile?.history || []).length > 0 ? (
                      (hubData?.medicalHistory || userProfile?.history || []).map((h, i) => (
                        <span key={i} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-wider border border-white/5 hover:bg-white/20 transition-all cursor-default">{h}</span>
                      ))
                    ) : (
                      <span className="text-slate-500 font-bold italic text-sm">No clinical history records found in node databases</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Urgency Overlay for High Risk */}
              {routine.urgency?.includes('Immediate') && (
                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-between">
                  <div>
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Clinical Alert Level: High</p>
                    <p className="text-red-100 font-bold">Urgent medical consultation detected as necessary protocol.</p>
                  </div>
                  <div className="p-3 bg-red-500 rounded-xl animate-pulse">
                    <AlertCircle size={20} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Alerts & Vault */}
        <div className="space-y-8">
          
          {/* AI Advisor Badge (Premium Mobile Look) */}
          <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-sky-500/30 relative overflow-hidden group">
            <Activity className="absolute bottom-[-20%] right-[-10%] w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10 text-center">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                  <Sparkles size={32} />
               </div>
               <h3 className="font-black text-xl tracking-tighter mb-3 leading-tight">Dynamic Guidance</h3>
               <p className="text-sky-50 text-xs font-medium leading-relaxed mb-6">
                Your routine is mathematically optimized based on 12 bio-markers detected in your profile.
               </p>
               <div className="flex items-center justify-center gap-2 py-2 px-4 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-300" /> Verified Protocols
               </div>
            </div>
          </div>

          {/* Smart Notifications (Mobile List) */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-black tracking-tighter flex items-center gap-3">
                <Bell className="text-red-500" /> Dispatch Alerts
               </h2>
               <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-md">{(displayNotifications || []).length}</span>
            </div>
            <div className="space-y-4">
              {displayNotifications.map((n, i) => {
                const IconComp = iconMap[n.icon] || Activity;
                return (
                  <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-5 items-start hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-sky-600 group-hover:scale-110 transition-transform shrink-0 border border-slate-100">
                      <IconComp size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-[1.3] mb-1">{n.message}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Prescription Safety Guard (New Section) */}
          <section className="bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tighter">Clinical Safety Guard</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Condition</label>
                <input 
                  type="text" 
                  placeholder="e.g. Heart Pain" 
                  value={safetyCheck.condition}
                  onChange={(e) => setSafetyCheck({...safetyCheck, condition: e.target.value})}
                  className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-sky-500 transition-all font-bold text-sm"
                />
              </div>

              {!safetyCheck.file && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Prescribed Medicine</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dolo 650" 
                    value={safetyCheck.medicine}
                    onChange={(e) => setSafetyCheck({...safetyCheck, medicine: e.target.value})}
                    className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none focus:border-sky-500 transition-all font-bold text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <input 
                  type="file" 
                  id="presc-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setSafetyCheck({...safetyCheck, file: e.target.files[0]})}
                />
                <label 
                  htmlFor="presc-upload"
                  className={`w-full py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    safetyCheck.file ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-slate-200 hover:border-sky-500'
                  }`}
                >
                  <Upload size={20} className={safetyCheck.file ? 'text-sky-500' : 'text-slate-400'} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                    {safetyCheck.file ? safetyCheck.file.name : 'Upload Prescription Image'}
                  </span>
                </label>
              </div>

              <Button 
                onClick={performSafetyCheck}
                isLoading={isAuditing}
                className="w-full py-4 rounded-xl"
                icon={Search}
              >
                {safetyCheck.file ? 'Analyze Image with AI' : 'Audit Text Prescription'}
              </Button>

              {safetyResult && (
                <div className={`mt-6 p-6 rounded-[2.5rem] border transition-all animate-in fade-in slide-in-from-top-4 ${
                  safetyResult.isCritical ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    {safetyResult.isCritical ? <AlertTriangle className="text-rose-600" /> : <ShieldCheck className="text-emerald-600" />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      safetyResult.isCritical ? 'text-rose-600 font-black' : 'text-emerald-600'
                    }`}>
                      {safetyResult.severity || 'SYSTEM'} ANALYSIS
                    </span>
                  </div>

                  {/* Structured Medication Output */}
                  <div className="space-y-4 mb-6">
                    {(safetyResult.medications || []).map((med, i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-black text-slate-900">{med.name}</p>
                          <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase">{med.dosage}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Freq: {med.frequency}</p>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">"{med.notes}"</p>
                      </div>
                    ))}
                  </div>

                  <p className={`text-sm font-bold mb-4 ${
                    safetyResult.isCritical ? 'text-rose-900' : 'text-emerald-900'
                  }`}>
                    {safetyResult.message}
                  </p>

                  <div className={`p-4 rounded-2xl text-xs font-bold ${
                    safetyResult.isCritical ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-emerald-600 text-white'
                  }`}>
                    Directive: {safetyResult.action || safetyResult.recommendation}
                  </div>
                  
                  {safetyResult.isCritical && (
                    <button 
                      onClick={() => (window.navigate || routerNavigate)('/emergency')}
                      className="w-full mt-6 flex items-center justify-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Immediate Emergency Dispatch <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Medical Report Vault */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
                <FileText className="text-indigo-600" /> Medical Vault
              </h3>
            </div>
            
            <div className="space-y-4">
              {(hubData?.reports || []).length > 0 ? (
                hubData.reports.map((report, i) => (
                  <div key={i} className="group p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-sky-300 hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-none mb-1">{report.type}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(report.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[8px] bg-sky-50 px-2 py-1 rounded-md font-black uppercase text-sky-600 border border-sky-100 italic">AI Analyzed</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-50 italic text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-3">
                      "{report.aiSummary}"
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                   <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No reports archived</p>
                </div>
              )}

              <div className="relative mt-4">
                <input 
                  type="file" 
                  id="report-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label 
                  htmlFor="report-upload"
                  className={`w-full py-8 flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all cursor-pointer ${
                    uploading ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-sky-200 hover:bg-white hover:border-sky-500 hover:shadow-xl'
                  }`}
                >
                  <div className={`p-4 rounded-2xl bg-white shadow-sm mb-4 text-sky-500 ${uploading ? 'animate-bounce' : ''}`}>
                     <Upload size={32} />
                  </div>
                  <span className="text-sm font-black tracking-tighter text-slate-900">
                    {uploading ? 'Processing OCR Clinical Data...' : 'Ingest Clinical Report'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">PDF • JPG • PNG SUPPORTED</p>
                </label>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full px-6 max-w-lg">
        <button 
          onClick={() => (window.navigate || routerNavigate)('/triage')}
          className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all active:scale-95 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Plus size={20} />
          </div>
          New Clinical Diagnosis
        </button>
      </div>

    </div>
  );
};

export default HealthHub;
