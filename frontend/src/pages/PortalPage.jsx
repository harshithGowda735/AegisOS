import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  LayoutDashboard, 
  ShieldCheck, 
  Activity,
  ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12">
      {/* Background patterns - Subtle SaaS look */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-4xl w-full z-10">
        <header className="text-center mb-16 page-animate opacity-0">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Aegis<span className="text-sky-500">OS</span></h1>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1]">
            Intelligent healthcare <br/> orchestration node.
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Production-grade triage and facility management system designed for regional medical nodes and autonomous clinics.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 page-animate opacity-0" style={{ animationDelay: '200ms' }}>
          {/* Patient / Triage Portal */}
          <div 
            onClick={() => navigate('/profiling')}
            className="group saas-card p-10 cursor-pointer text-left"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-50 transition-colors mb-8">
              <Activity size={28} className="group-hover:text-sky-500 transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Patient Terminal</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Autonomous AI triage for symptoms, profiling, and regional hospital routing.
            </p>
            <div className="flex items-center text-sky-500 font-bold group-hover:gap-2 transition-all">
              Initialize Triage <ArrowRight size={18} className="ml-1" />
            </div>
          </div>

          {/* Admin / Dashboard Portal */}
          <div 
            onClick={() => navigate('/admin/dashboard')}
            className="group saas-card p-10 cursor-pointer text-left"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 transition-colors mb-8">
              <LayoutDashboard size={28} className="group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Hospital Management</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Real-time telemetry, staff planning, and AI-driven resources for administrators.
            </p>
            <div className="flex items-center text-slate-900 font-bold group-hover:gap-2 transition-all">
              Launch Console <ArrowRight size={18} className="ml-1" />
            </div>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 page-animate opacity-0" style={{ animationDelay: '400ms' }}>
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Status: Optimal</div>
              <div>Node ID: Aegis-PRD-01</div>
           </div>
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-grayscale cursor-pointer">
                 <Terminal size={16} />
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default PortalPage;
