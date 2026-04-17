import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  LayoutDashboard, 
  ShieldCheck, 
  ShieldAlert,
  Activity,
  ArrowRight,
  DatabaseZap,
  LockKeyhole,
  Globe,
  Cpu,
  Menu
} from 'lucide-react';
import Button from '../components/ui/Button';

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 260, damping: 20 } 
  }
};

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#FDFEFF] text-slate-900 font-sans flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-x-hidden selection:bg-indigo-100">
      
      {/* ─── ENHANCED BACKGROUND SYSTEM ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[5%] -left-[10%] w-[100%] sm:w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-[80px] sm:blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[0%] -right-[10%] w-[100%] sm:w-[60%] h-[60%] rounded-full bg-sky-100/30 blur-[80px] sm:blur-[100px]" 
        />
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.03] sm:opacity-[0.04] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="proGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#proGrid)" />
        </svg>
      </div>

      {/* ─── MOBILE TOP NAV (SaaS Look) ─────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full z-50 p-4 md:hidden">
        <div className="bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-2xl px-4 py-3 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-2">
             <ShieldCheck className="text-indigo-600 w-5 h-5" />
             <span className="font-black text-slate-950 tracking-tight text-sm">AegisOS</span>
           </div>
           <div className="px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1.5 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Live</span>
           </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────── */}
      <motion.div 
        className="max-w-6xl w-full z-10 mt-16 md:mt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="text-center mb-12 md:mb-24">
          <div className="hidden md:flex items-center justify-center gap-3 mb-8">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30"
            >
              <ShieldCheck size={32} strokeWidth={2.5}/>
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Aegis<span className="text-indigo-600">OS</span>
            </h1>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-950 tracking-tighter mb-6 md:mb-8 leading-[1.1] sm:leading-[1.05]">
            Intelligent Health <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">Orchestration.</span>
          </h2>
          
          <p className="text-slate-500 text-base sm:text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
            The mission-critical triage engine designed for regional medical hubs and autonomous clinic management.
          </p>
        </motion.header>

        {/* Portal Grid - Stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10 px-0 sm:px-4">
          
          {/* Patient / Triage Portal */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profiling')}
            className="group relative bg-white/70 backdrop-blur-xl p-8 sm:p-10 cursor-pointer rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-lg shadow-slate-200/40 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 sm:mb-8 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Activity size={28} className="sm:size-[32px]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2 sm:mb-3 tracking-tight">Health Platform</h3>
            <p className="text-slate-500 text-sm sm:text-lg font-medium mb-8 sm:mb-10 leading-relaxed">
              Standard clinical triage and profiling for non-urgent care and appointment routing.
            </p>
            <div className="flex items-center text-indigo-600 font-bold text-base">
              <span>Enter Portal</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>

          {/* Admin / Dashboard Portal */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/dashboard')}
            className="group relative bg-slate-900 p-8 sm:p-10 cursor-pointer rounded-[2rem] sm:rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white/40 mb-6 sm:mb-8 border border-white/5 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
              <LayoutDashboard size={28} className="sm:size-[32px]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 tracking-tight">Admin Console</h3>
            <p className="text-slate-400 text-sm sm:text-lg font-medium mb-8 sm:mb-10 leading-relaxed">
              Regional telemetry, live facility orchestration, and resource management node.
            </p>
            <div className="flex items-center text-white font-bold text-base">
              <span>Launch Hub</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>

          {/* EMERGENCY TERMINAL - NEW */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/emergency-terminal')}
            className="group relative bg-rose-600 p-8 sm:p-10 cursor-pointer rounded-[2rem] sm:rounded-[2.5rem] md:col-span-2 shadow-2xl shadow-rose-600/30 overflow-hidden"
          >
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-white/10"
             />
             <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/30 group-hover:bg-white group-hover:text-rose-600 transition-all duration-300">
                     <ShieldAlert size={32} className="animate-pulse" />
                   </div>
                   <h3 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tighter">Emergency Distress Terminal</h3>
                   <p className="text-rose-100 text-sm sm:text-xl font-medium leading-relaxed">
                     Fast-entry mode for urgent distress. Automatically dispatches nearest ambulance and routes to optimized medical hubs.
                   </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                   <div className="px-6 py-3 bg-white text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl group-hover:scale-110 transition-transform">
                      Initiate Rescue
                   </div>
                   <div className="flex items-center gap-2 text-rose-200 text-[10px] font-black uppercase tracking-[0.2em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Satellite GIS Active
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* ─── PRODUCTION FOOTER ───────────────────────────────────────── */}
        <motion.footer 
          variants={itemVariants}
          className="mt-16 md:mt-24 pt-8 border-t border-slate-100 flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="hidden xs:inline">Network Status:</span> Optimal
            </div>
            <div className="flex items-center gap-2"><Globe size={14}/> Node: Mumbai-AZ-1</div>
            <div className="flex items-center gap-2"><LockKeyhole size={14}/> <span className="hidden xs:inline">HIPAA</span> Compliant</div>
          </div>
          
          <div className="flex items-center gap-4 pb-8 md:pb-0">
             <motion.div 
               whileHover={{ rotate: 180 }}
               className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
             >
               <Terminal size={18} />
             </motion.div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
               <Cpu size={18} />
             </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default PortalPage;