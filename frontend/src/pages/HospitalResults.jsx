import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import HospitalCard from '../components/hospital/HospitalCard';
import SeverityBadge from '../components/ui/SeverityBadge';
import { 
  ArrowLeft, 
  RefreshCcw, 
  ShieldCheck, 
  Activity, 
  MapPin,
  Sparkles,
  Info
} from 'lucide-react';
import Button from '../components/ui/Button';


const HospitalResults = () => {
  const { triageData, hospitals, bestHospital, isLoading, resetSession } = useAppStore();
  const navigate = useNavigate();

  if (isLoading || !triageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
        <Activity className="w-16 h-16 text-sky-500 animate-pulse mb-8" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-2">Analyzing clinical data...</h2>
        <p className="text-slate-500 font-medium text-center max-w-sm">Aegis AI Node is calculating regional hospital wait times and staff availability.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="p-6 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <button 
                onClick={() => navigate('/triage')}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
             >
                <ArrowLeft size={18} />
             </button>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagnosis Snapshot</span>
           </div>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter">Analysis Results</h1>
              <SeverityBadge severity={triageData.severity} />
           </div>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => navigate('/emergency')} variant="danger" className="rounded-xl px-8">Immediate ER</Button>
           <Button onClick={resetSession} variant="secondary" icon={RefreshCcw} className="rounded-xl">Recalculate</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Diagnostic Profile Column */}
          <div className="lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-12 space-y-10 page-animate opacity-0">
             <section>
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Aegis AI Summary</h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                   "{triageData.summary}"
                </div>
             </section>

             <section>
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Recommended Care</h3>
                <div className="space-y-3">
                   {triageData.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                         <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-[8px] shrink-0 mt-0.5">{i+1}</div>
                         {rec}
                      </div>
                   ))}
                </div>
             </section>

             <div className="p-6 bg-sky-50 rounded-3xl border border-sky-100">
                <div className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest mb-2">
                   <ShieldCheck size={14} /> Optimization active
                </div>
                <p className="text-xs font-medium text-slate-600">
                   Routing is weighted by specializations matching your medical background and live node occupancy.
                </p>
             </div>
          </div>

          {/* Hospitals Grid Column */}
          <div className="lg:col-span-3">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Regional Facilities</h2>
                <div className="flex gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                   <div className="flex items-center gap-1.5"><MapPin size={12} /> Near You</div>
                   <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-sky-500" /> AI Ranked</div>
                </div>
             </div>



             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 page-animate opacity-0" style={{ animationDelay: '200ms' }}>
                {hospitals.map(hospital => (
                  <HospitalCard 
                    key={hospital.id} 
                    hospital={hospital} 
                    isRecommended={bestHospital?.id === hospital.id} 
                  />
                ))}
             </div>

             {hospitals.length === 0 && (
               <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                  <Info className="mx-auto mb-4 text-slate-300" size={48} />
                  <h3 className="text-xl font-bold text-slate-400">No matching facilities in range.</h3>
                  <p className="text-slate-400 text-sm">Expand search radius or consult the emergency node.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalResults;
