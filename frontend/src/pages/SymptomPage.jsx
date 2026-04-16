import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { 
  Activity, 
  ArrowLeft, 
  Search, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const SymptomPage = () => {
  const { processSymptoms, isLoading, userProfile } = useAppStore();
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const success = await processSymptoms(input);
    if (success) {
      if (useAppStore.getState().isAutonomouslyBooked) {
        navigate('/booking');
      } else {
        navigate('/results');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-slate-50">
        <button 
          onClick={() => navigate('/profiling')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100">
            <ArrowLeft size={18} />
          </div>
          Back to Profile
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[10px]">
             {userProfile?.age || '25'}
          </div>
          <p className="text-sm font-black text-slate-900 tracking-tight">{userProfile?.gender || 'Patient'}</p>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 md:p-14">
        <div className="max-w-2xl w-full page-animate opacity-0">
          <header className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-sky-100">
                <Sparkles size={12} /> AI Symptom Analysis
             </div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">How are you feeling?</h1>
             <p className="text-slate-500 font-medium">Describe your symptoms in natural language. Our AI node will analyze severity and match you with the best regional facility.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
               <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I have a persistent sharp pain in my chest and difficulty breathing..."
                className="w-full h-48 bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-xl font-medium text-slate-700 outline-none transition-all focus:border-sky-500 focus:shadow-2xl focus:shadow-sky-500/5 resize-none"
               />
               <div className="absolute top-8 right-8 text-slate-100 group-focus-within:text-sky-100 transition-colors">
                  <Activity size={32} />
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full md:w-auto px-10 py-5 rounded-2xl text-lg flex-1"
                icon={Search}
              >
                Analyze Symptoms
              </Button>
              <button 
                type="button"
                onClick={() => navigate('/emergency')}
                className="w-full md:w-auto px-10 py-5 bg-rose-50 text-rose-600 font-black rounded-2xl text-sm hover:bg-rose-100 transition-all border border-rose-100"
              >
                Immediate Emergency
              </button>
            </div>
          </form>

          <footer className="mt-12 flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <ShieldCheck size={20} className="text-slate-400 shrink-0" />
             <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
               <span className="font-black text-slate-500">Security Note:</span> Your clinical data is processed by Aegis Node #01. No PII is shared externally during the routing process.
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SymptomPage;
