import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { Brain, Sparkles, ShieldCheck, Activity, ArrowLeft } from 'lucide-react';

const SymptomPage = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const { processSymptoms, isLoading } = useAppStore();
  const navigate = useNavigate();

  const steps = [
    "Analyzing symptoms...",
    "Scanning diagnostic database...",
    "Identifying clinical patterns...",
    "Calculating triage severity...",
    "Optimizing hospital routing..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setAnalysisStep(0);
      interval = setInterval(() => {
        setAnalysisStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 800);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptomInput.trim() || isLoading) return;
    
    const success = await processSymptoms(symptomInput);
    if (success) {
      // Small delay for the UX feel of "completing" the analysis
      setTimeout(() => navigate('/results'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Subtle Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] -z-10"></div>

      {/* Back to Portal Button */}
      {!isLoading && (
        <div className="absolute top-8 left-8 page-animate opacity-0">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-500 font-black hover:translate-x-[-4px]"
            icon={ArrowLeft}
          >
            Terminal Portal
          </Button>
        </div>
      )}

      <div className="w-full max-w-2xl glass rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-10 md:p-14 text-center page-animate opacity-0">
        
        <div className="mx-auto w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/30 transition-transform hover:scale-110 duration-500">
          <Brain className="w-10 h-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight">
          Aegis<span className="text-indigo-600">OS</span> Triage
        </h1>
        <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed font-medium">
          Powered by clinical-grade AI. Describe your condition with natural language for immediate routing.
        </p>

        <form onSubmit={handleAnalyze} className="w-full relative">
          <div className="relative group">
            <textarea
              className="w-full bg-white border-2 border-slate-100 text-slate-800 rounded-3xl p-6 md:p-8 text-xl focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all duration-500 resize-none min-h-[180px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] group-hover:shadow-lg"
              placeholder="e.g. Sharp pain in lower abdomen, nausea, and slight fever since this morning..."
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            {!isLoading && (
              <div className="absolute bottom-4 right-6 text-slate-300 text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> SECURE DATA
              </div>
            )}
          </div>
          
          <div className="mt-10 min-h-[100px] flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl mb-4">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span>{steps[analysisStep]}</span>
                </div>
                <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                    style={{ width: `${((analysisStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <Button 
                type="submit" 
                disabled={!symptomInput.trim()}
                className="w-full py-5 text-xl"
                icon={Activity}
              >
                Analyze Symptoms
              </Button>
            )}
          </div>
        </form>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 font-bold text-xs tracking-widest uppercase">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> HIPAA COMPLIANT</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> REAL-TIME TRIAGE</div>
        </div>
      </div>

      <div className="mt-10 text-slate-400 font-medium text-sm">
        AegisOS v4.2.0 • Autonomous Healthcare Intelligence
      </div>
    </div>
  );
};

export default SymptomPage;
