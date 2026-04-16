import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, ShieldAlert, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Button from '../components/ui/Button';

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[160px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] -z-10"></div>

      <div className="w-full max-w-6xl z-10">
        <header className="text-center mb-16 page-animate opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-bold text-xs tracking-widest uppercase mb-6">
            <ShieldCheck className="w-4 h-4" /> v4.5 Enterprise Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Aegis<span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">OS</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The next-generation autonomous healthcare operating system. Select a terminal to begin your workspace session.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Patient / Triage Portal */}
          <div 
            onClick={() => navigate('/profiling')}
            className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-10 md:p-14 cursor-pointer transition-all duration-500 hover:bg-slate-800/60 hover:border-indigo-500/50 hover:-translate-y-3 page-animate opacity-0"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-500">
              <Brain className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">AI Patient Triage</h2>
            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              Describe symptoms in natural language for intelligent routing, severity analysis, and facility reservations.
            </p>
            <div className="flex items-center gap-3 text-indigo-400 font-black text-sm uppercase tracking-widest">
              Access Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
            
            {/* Status indicators */}
            <div className="mt-12 flex gap-4">
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div> AI Core Active
              </div>
            </div>
          </div>

          {/* Admin / Dashboard Portal */}
          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-10 md:p-14 cursor-pointer transition-all duration-500 hover:bg-slate-800/60 hover:border-indigo-500/50 hover:-translate-y-3 page-animate opacity-0"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-20 h-20 bg-slate-700 text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl group-hover:bg-indigo-600 group-hover:shadow-indigo-600/30 transition-all duration-500">
              <LayoutDashboard className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Hospital Management</h2>
            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              Real-time telemetry, capacity planning, and AI-driven resource allocation for hospital administrators.
            </p>
            <div className="flex items-center gap-3 text-slate-400 group-hover:text-indigo-400 transition-colors font-black text-sm uppercase tracking-widest">
              Admin Login <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>

            {/* Status indicators */}
            <div className="mt-12 flex gap-4">
              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                 <Activity className="w-3 h-3" /> Live Telemetry Linked
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 page-animate opacity-0" style={{ animationDelay: '300ms' }}>
          <Button 
            variant="danger" 
            className="px-12 py-5 rounded-full shadow-2xl" 
            icon={ShieldAlert}
            onClick={() => navigate('/emergency')}
          >
            Immediate Emergency Dispatch
          </Button>
          <p className="text-slate-500 font-bold text-xs tracking-[0.3em] uppercase">
            Secured by Aegis Protocol • Privacy Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
