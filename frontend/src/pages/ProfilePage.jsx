import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { 
  User, 
  Calendar, 
  Activity, 
  Stethoscope, 
  ChevronRight, 
  ShieldCheck,
  Check
} from 'lucide-react';

const ProfilePage = () => {
  const { setUserProfile, isLoading } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    history: []
  });
  const navigate = useNavigate();

  const medicalHistoryOptions = [
    "Diabetes", "Hypertension", "Heart Disease", "Asthma", "Allergies", "None"
  ];

  const handleNext = () => setStep(s => s + 1);
  
  const handleSubmit = async () => {
    const success = await setUserProfile(formData);
    if (success) navigate('/triage');
  };

  const toggleHistory = (condition) => {
    setFormData(prev => ({
      ...prev,
      history: prev.history.includes(condition) 
        ? prev.history.filter(h => h !== condition)
        : [...prev.history, condition]
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-14 font-sans text-slate-900">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-sky-500' : 'bg-slate-100'}`}></div>
          ))}
        </div>

        <div className="page-animate opacity-0">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-4xl font-black tracking-tighter mb-2">Age & Demographics</h1>
                <p className="text-slate-400 font-medium">This anonymous data helps the AI node weight severity risks.</p>
              </header>
              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Age</label>
                   <input 
                    type="number" 
                    placeholder="e.g., 28"
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none font-black text-xl text-slate-900 border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setFormData({...formData, gender: g})}
                      className={`p-5 rounded-2xl border-2 font-black text-sm transition-all ${formData.gender === g ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleNext} disabled={!formData.age || !formData.gender} className="w-full py-5 rounded-2xl" icon={ChevronRight}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-4xl font-black tracking-tighter mb-2">Medical Background</h1>
                <p className="text-slate-400 font-medium">Select any pre-existing conditions that apply to you.</p>
              </header>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {medicalHistoryOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => toggleHistory(option)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${formData.history.includes(option) ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <span className={`font-bold ${formData.history.includes(option) ? 'text-sky-600' : 'text-slate-500'}`}>{option}</span>
                    {formData.history.includes(option) && <Check size={18} className="text-sky-600" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                 <Button onClick={() => setStep(1)} variant="secondary" className="flex-1 rounded-2xl">Back</Button>
                 <Button onClick={handleNext} className="flex-[2] rounded-2xl" icon={ChevronRight}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="text-center">
                <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-500/10">
                   <ShieldCheck size={40} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-4">Node Link Ready</h1>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Your clinical profile is anonymized and ready for AI orchestration. Proceed to symptom analysis.</p>
              </header>
              
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Aegis Profile Summary</p>
                 <p className="text-xl font-black text-slate-900">{formData.age}y • {formData.gender}</p>
                 <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {formData.history.map(h => (
                       <span key={h} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase text-slate-400">{h}</span>
                    ))}
                 </div>
              </div>

              <Button onClick={handleSubmit} isLoading={isLoading} className="w-full py-6 rounded-[1.5rem] shadow-2xl shadow-sky-500/20 text-lg">Initialize Analysis</Button>
            </div>
          )}
        </div>

        <footer className="mt-20 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Aegis Triage Node • Secure Session</p>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
