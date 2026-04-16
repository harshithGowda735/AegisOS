import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import HospitalCard from '../components/hospital/HospitalCard';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import SeverityBadge from '../components/ui/SeverityBadge';
import { ArrowLeft, Filter, Search } from 'lucide-react';

const HospitalResults = () => {
  const { symptoms, severity, hospitals, bestHospital, setBestHospital } = useAppStore();
  const navigate = useNavigate();
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (!symptoms || symptoms.length === 0) {
      navigate('/');
      return;
    }
    
    // Simulate a brief "data preparation" step for high-end SaaS feel
    const timer = setTimeout(() => setInternalLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [symptoms, navigate]);

  const handleSelectHospital = (hospital) => {
    setBestHospital(hospital);
    navigate('/booking');
  };

  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8 font-sans">
      <div className="w-full max-w-7xl">
        
        {/* Navigation & Header */}
        <div className="mb-12 page-animate opacity-0">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 -ml-4 hover:translate-x-[-4px]"
            icon={ArrowLeft}
          >
            Back to Triage
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SeverityBadge severity={severity} />
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                  Analysis Complete
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Recommended Facilities
              </h1>
              <p className="text-slate-500 text-lg mt-3 font-medium">
                Showing hospitals with specialized care for <span className="text-slate-800 font-bold">{symptoms.join(', ')}</span>.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter by name..." 
                  className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none w-64 shadow-sm"
                />
              </div>
              <Button variant="secondary" icon={Filter} className="h-[46px]">Filters</Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {internalLoading ? (
            // Skeleton State
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between">
                  <Skeleton className="w-1/2 h-8" />
                  <Skeleton className="w-12 h-6" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
                <Skeleton className="h-14 w-full" />
              </div>
            ))
          ) : (
            hospitals.map((hospital, index) => {
              const isBest = bestHospital && hospital.id === bestHospital.id;
              
              return (
                <div 
                  key={hospital.id} 
                  className="opacity-0 page-animate" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HospitalCard 
                    hospital={hospital} 
                    isBest={isBest}
                    severity={severity}
                    onSelect={handleSelectHospital} 
                  />
                </div>
              );
            })
          )}
        </div>
        
        {/* Help Banner */}
        {!internalLoading && (
          <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 page-animate opacity-0 stagger-3">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-black mb-4 tracking-tight">Need specialized assistance?</h2>
              <p className="text-slate-400 text-lg font-medium">Our clinical concierge team is available 24/7 to help you navigate complex medical requirements and insurance paperwork.</p>
            </div>
            <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/20 whitespace-nowrap px-10">
              Speak to specialized concierge
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default HospitalResults;
