import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { User, Activity, ClipboardList, ChevronRight, Check } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUserProfile, isLoading } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    medicalHistory: []
  });

  const conditions = [
    "Diabetes", "Hypertension", "Asthma", "Heart Disease", 
    "Kidney Disease", "Prior Surgery", "Drug Allergies", "Thyroid"
  ];

  const handleToggleCondition = (condition) => {
    setProfile(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const success = await setUserProfile(profile);
      if (success) navigate('/triage');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans overflow-hidden py-20">
      
      <div className="w-full max-w-xl glass rounded-[3rem] p-10 md:p-14 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] border border-white page-animate opacity-0">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`}
            ></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Tell us about yourself</h1>
            <p className="text-slate-500 mb-8 font-medium">Basic demographics help AegisOS optimize your care routing.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 28"
                  className="w-full bg-white border-2 border-slate-50 rounded-2xl py-5 px-6 text-2xl font-black outline-none focus:border-indigo-500 transition-all shadow-sm"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Select Gender</h1>
            <p className="text-slate-500 mb-10 font-medium">This context is used to calibrate clinical risk assessments.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => (
                <button
                  key={g}
                  onClick={() => setProfile({...profile, gender: g})}
                  className={`w-full py-5 rounded-2xl border-2 font-bold text-lg transition-all ${profile.gender === g ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Medical Background</h1>
            <p className="text-slate-500 mb-10 font-medium">Select any pre-existing conditions that might affect your case.</p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {conditions.map(c => (
                <button
                  key={c}
                  onClick={() => handleToggleCondition(c)}
                  className={`px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-2 ${profile.medicalHistory.includes(c) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'}`}
                >
                  {c} {profile.medicalHistory.includes(c) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
          {step > 1 ? (
             <button onClick={() => setStep(step-1)} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">Previous Step</button>
          ) : <div></div>}
          
          <Button 
            onClick={handleNext} 
            disabled={step === 1 ? !profile.age : step === 2 ? !profile.gender : false}
            isLoading={isLoading && step === 3}
            className="px-10"
            icon={step < 3 ? ChevronRight : null}
          >
            {step < 3 ? 'Continue' : 'Complete Profile'}
          </Button>
        </div>
      </div>
      
      <p className="mt-10 text-slate-400 font-bold text-xs tracking-widest uppercase text-center flex items-center gap-2">
         AegisOS Smart Intake Flow • HIPAA Secure
      </p>
    </div>
  );
};

export default ProfilePage;
