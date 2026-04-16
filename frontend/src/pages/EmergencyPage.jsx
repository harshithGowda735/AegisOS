import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-white/30">
      
      <div className="mb-10 lg:mb-14 animate-pulse flex items-center justify-center w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-full shadow-[0_0_80px_rgb(255,255,255,0.5)]">
        <svg className="w-16 h-16 lg:w-20 lg:h-20 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <div className="text-center max-w-4xl mx-auto w-full z-10">
        <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[8rem] font-black mb-4 md:mb-6 uppercase tracking-tighter leading-none text-white drop-shadow-xl">
          Emergency Mode
        </h1>
        
        <p className="text-xl md:text-3xl font-bold text-red-100 mb-14 md:mb-20 max-w-2xl mx-auto leading-tight drop-shadow-md">
          Immediate Dispatch Protocol. Bypass triage and connect directly to services.
        </p>

        <a 
          href="tel:911" 
          className="inline-flex w-full md:w-auto items-center justify-center gap-4 bg-white text-red-600 hover:text-red-700 hover:bg-gray-50 text-4xl md:text-5xl lg:text-6xl font-black py-8 px-10 md:py-10 md:px-24 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-100 transform active:scale-[0.97] shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <span className="text-5xl md:text-6xl drop-shadow-sm">📞</span> 
          Call Ambulance
        </a>
      </div>

      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 md:top-10 md:left-10 text-red-100/70 hover:text-white font-bold tracking-widest text-sm uppercase transition-colors"
      >
        ← Esc
      </button>

    </div>
  );
};

export default EmergencyPage;
